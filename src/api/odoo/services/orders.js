import { odooGet, odooGetQuiet } from "../client";
import {
  formatPartnerAddress,
  mapCartFromOrder,
  mapOrder,
  mergeShippingPartner,
} from "../mappers";
import { m2oId } from "../utils";
import { getOdooSession, setDraftOrderId } from "../session";
import {
  fail,
  isOdooAccessError,
  isOdooSuccess,
  odooDataList,
  ok,
} from "../utils";
import {
  buildOrderItemsWithImages,
  fetchOrderLines,
  getOrCreateDraftOrder,
} from "./cart";
import { resolveOrderPartnerIds } from "./contacts";

function providerCode(p) {
  return Array.isArray(p?.code) ? p.code[0] : p?.code;
}

function resolveProvider(providers, paymentMethod) {
  const method = String(paymentMethod || "").toUpperCase();
  if (method === "COD") {
    return (
      providers.find((p) => providerCode(p) === "custom") ||
      providers.find((p) =>
        String(p.name || "").toLowerCase().includes("cash")
      )
    );
  }
  return (
    providers.find((p) =>
      String(p.name || "")
        .toLowerCase()
        .includes(String(paymentMethod).toLowerCase())
    ) || providers[0]
  );
}

function extractTransactionId(txPayload) {
  const row = txPayload?.response?.[0];
  if (row?.id) return row.id;
  return txPayload?.response?.transaction_id || txPayload?.response?.id || null;
}

/** Provider ids to try for payment (COD custom provider often 422 on Odoo — demo works). */
function checkoutProviderIds(providers, paymentMethod, preferredId) {
  const method = String(paymentMethod || "").toUpperCase();
  if (method === "TEST PAYMENT") {
    const demo = providers.find((p) => providerCode(p) === "demo");
    return demo?.id ? [demo.id] : [];
  }
  
  const demo = providers.find((p) => providerCode(p) === "demo");
  const customCod = providers.find((p) => providerCode(p) === "custom" || String(p.name || "").toLowerCase().includes("cash"));
  
  const ids = [];
  
  if (preferredId && !ids.includes(preferredId)) {
    ids.push(preferredId);
  }
  
  if (method === "COD" || method === "CASH") {
    if (customCod?.id && !ids.includes(customCod.id)) ids.push(customCod.id);
  }
  
  if (demo?.id && !ids.includes(demo.id)) {
    ids.push(demo.id);
  }
  return ids;
}

async function finalizePayment(orderId, providerId, paymentMethod, providers) {
  const demo = providers.find((p) => providerCode(p) === "demo");
  const providerIds = checkoutProviderIds(
    providers,
    paymentMethod,
    providerId
  );

  for (const pid of providerIds) {
    const txPayload = await odooGetQuiet(
      `/api/order/${orderId}/get_or_create_transaction`,
      { args: `[${pid}]` }
    );
    if (txPayload && (txPayload.success === 0 || txPayload.success === "0")) continue;

    const transactionId = extractTransactionId(txPayload);
    if (!transactionId) continue;

    const markIds = [pid, demo?.id].filter(
      (id, i, arr) => id && arr.indexOf(id) === i
    );
    for (const markProviderId of markIds) {
      const donePayload = await odooGetQuiet(
        `/api/order/${orderId}/order_transaction_mark_done`,
        {
          transaction_id: transactionId,
          provider_id: markProviderId,
        }
      );
      if (!donePayload || (donePayload.success !== 0 && donePayload.success !== "0")) {
        return { ok: true, transactionId, providerId: markProviderId };
      }
    }
  }

  const saleUpdate = await odooGetQuiet(`/api/order/${orderId}/update`, {
    state: "sale",
  });
  if (isOdooSuccess(saleUpdate)) {
    return { ok: true, fallback: "state_sale" };
  }

  return { ok: false, message: "payment_confirmation_failed" };
}

const CHECKOUT_SESSION_MSG =
  "Your cart session expired or is invalid. Please refresh the page, review your cart, and try again.";

async function syncCheckoutOrder(
  orderId,
  partners,
  { orderNote, carrierId } = {}
) {
  const extras = { origin: "website" };
  if (orderNote) extras.note = orderNote;
  if (carrierId) extras.carrier_id = carrierId;

  const attempts = [
    {
      ...extras,
      partner_id: partners.partner_id,
      partner_shipping_id: partners.partner_shipping_id,
      partner_invoice_id: partners.partner_invoice_id,
    },
    {
      ...extras,
      partner_shipping_id: partners.partner_shipping_id,
      partner_invoice_id: partners.partner_invoice_id,
    },
    {
      ...extras,
      partner_shipping_id: partners.partner_shipping_id,
    },
  ];

  let lastPayload = null;
  for (const params of attempts) {
    const payload = await odooGetQuiet(`/api/order/${orderId}/update`, params);
    lastPayload = payload;
    if (isOdooSuccess(payload)) return payload;
    if (!isOdooAccessError(payload?.message)) break;
  }
  return lastPayload;
}

async function loadShippingPartner(order, session) {
  const shipId =
    m2oId(order.partner_shipping_id) || m2oId(order.partner_id);
  let fetched = null;
  if (shipId) {
    try {
      const contactPayload = await odooGet(`/api/contacts/${shipId}`);
      fetched = odooDataList(contactPayload)[0] || null;
    } catch {
      fetched = null;
    }
  }
  let merged = mergeShippingPartner(order, fetched);
  if (!formatPartnerAddress(merged)) {
    const parentId = m2oId(merged.parent_id);
    if (parentId && parentId !== shipId) {
      try {
        const parentPayload = await odooGet(`/api/contacts/${parentId}`);
        const parent = odooDataList(parentPayload)[0];
        if (parent) {
          merged = {
            ...parent,
            name: merged.name || parent.name,
            phone: merged.phone || merged.mobile || parent.phone,
          };
        }
      } catch {
        /* ignore */
      }
    }
  }
  if (
    !formatPartnerAddress(merged) &&
    session?.partnerId &&
    session.partnerId !== shipId
  ) {
    try {
      const mainPayload = await odooGet(`/api/contacts/${session.partnerId}`);
      const main = odooDataList(mainPayload)[0];
      if (main) {
        merged = {
          ...main,
          name: merged.name || main.name,
          phone: merged.phone || merged.mobile || main.phone,
        };
      }
    } catch {
      /* ignore */
    }
  }
  return merged;
}

export async function getOrders({ limit = 10, offset = 0, orderId, type } = {}) {
  const session = getOdooSession();
  if (!session?.partnerId) return fail("not_authenticated");
  try {
    if (orderId) {
      const payload = await odooGet(`/api/order/${orderId}`);
      const order = odooDataList(payload)[0];
      if (!order) return fail("order_not_found");
      const lines =
        order.order_line?.length > 0
          ? order.order_line
          : await fetchOrderLines(order.id);
      const shippingPartner = await loadShippingPartner(order, session);
      const mapped = mapOrder({ ...order, order_line: lines }, shippingPartner);
      const items = await buildOrderItemsWithImages(
        lines,
        mapped.active_status
      );
      return ok([{ ...mapped, items, order_items: items }]);
    }

    const domain = `[('partner_id','=',${session.partnerId})]`;
    const payload = await odooGet("/api/order", { domain });
    let orders = odooDataList(payload).filter((o) => {
      const state = Array.isArray(o.state) ? o.state[0] : o.state;
      if (type === "previous") return ["done", "cancel"].includes(state);
      if (type === "active") return !["done", "cancel", "draft"].includes(state);
      return state !== "draft";
    });

    orders = orders.slice(offset, offset + limit);
    const result = [];
    for (const order of orders) {
      const lines = await fetchOrderLines(order.id);
      const mapped = mapOrder({ ...order, order_line: lines });
      const items = await buildOrderItemsWithImages(lines, mapped.active_status);
      result.push({ ...mapped, items, order_items: items });
    }
    return ok(result);
  } catch (e) {
    console.error("[Odoo] getOrders", e);
    return fail(e?.message);
  }
}

/**
 * Sync draft order delivery/invoice contacts and optional carrier (Coop ERP).
 */
export async function updateOrderDelivery({
  orderId,
  carrierId,
  shippingContactId,
  invoiceContactId,
  origin = "website",
} = {}) {
  try {
    const session = getOdooSession();
    const order = orderId
      ? { id: orderId }
      : await getOrCreateDraftOrder();
    if (!order?.id) return fail("no_cart");

    const partners = resolveOrderPartnerIds({
      shippingAddressId: shippingContactId,
      invoiceAddressId: invoiceContactId,
      partnerId: session?.partnerId,
      uid: session?.uid,
    });

    const params = {
      origin,
      partner_id: partners.partner_id,
      partner_shipping_id: partners.partner_shipping_id,
      partner_invoice_id: partners.partner_invoice_id,
    };
    if (carrierId) params.carrier_id = carrierId;

    const payload = await odooGet(`/api/order/${order.id}/update`, params);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok({ order_id: order.id });
  } catch (e) {
    return fail(e?.message);
  }
}

export async function placeOrder({
  paymentMethod,
  addressId,
  invoiceAddressId,
  carrierId,
  deliveryCharge,
  orderNote,
  order_type,
  promocodeId,
}) {
  try {
    const session = getOdooSession();
    const order = await getOrCreateDraftOrder();
    if (!order?.id) return fail("no_cart");

    const lines = await fetchOrderLines(order.id);
    if (!lines.length) return fail("empty_cart");

    const orderPartner = m2oId(order.partner_id);
    if (
      session.partnerId &&
      orderPartner &&
      orderPartner !== session.partnerId
    ) {
      setDraftOrderId(null);
      return fail(CHECKOUT_SESSION_MSG);
    }

    const partners = resolveOrderPartnerIds({
      shippingAddressId: addressId,
      invoiceAddressId: invoiceAddressId,
      partnerId: session?.partnerId,
      uid: session?.uid,
    });

    let resolvedCarrierId = carrierId;
    if (!resolvedCarrierId) {
      try {
        const { getDeliveryMethods } = await import("./delivery");
        const methods = await getDeliveryMethods();
        resolvedCarrierId = methods.data?.[0]?.carrier_id || methods.data?.[0]?.id;
      } catch {
        /* optional */
      }
    }

    const updatePayload = await syncCheckoutOrder(order.id, partners, {
      orderNote,
      carrierId: resolvedCarrierId,
    });
    if (!isOdooSuccess(updatePayload)) {
      if (isOdooAccessError(updatePayload?.message)) {
        setDraftOrderId(null);
        return fail(CHECKOUT_SESSION_MSG);
      }
      return fail(updatePayload?.message || "order_update_failed");
    }

    if (promocodeId) {
      try {
        const { getLoyaltyCoupons, applyLoyaltyPoint } = await import("./loyalty");
        const cardId = Number(promocodeId);
        const cards = await getLoyaltyCoupons();
        const card = cards.data?.find((c) => c.id === cardId);
        if (card?.reward_id) {
          await applyLoyaltyPoint({
            orderId: order.id,
            rewardId: card.reward_id,
            cartId: card.cart_id || cardId,
          });
        }
      } catch (loyaltyErr) {
        console.warn("[Odoo] loyalty apply on placeOrder", loyaltyErr);
      }
    }

    const payPayload = await odooGet("/api/payment-provider", {
      domain: "[('state','in',['enabled','test'])]",
    });
    const providers = odooDataList(payPayload);
    const provider = resolveProvider(providers, paymentMethod);
    const providerId = provider?.id;

    const method = String(paymentMethod || "").toUpperCase();
    const requiresImmediateConfirm =
      method === "COD" ||
      method === "WALLET" ||
      method === "CASH" ||
      method === "TEST PAYMENT";

    const paid = await finalizePayment(
      order.id,
      providerId,
      paymentMethod,
      providers
    );

    if (requiresImmediateConfirm && !paid.ok) {
      return fail(paid.message);
    }

    if (!paid.ok) {
      await odooGetQuiet(`/api/order/${order.id}/update`, { state: "sent" });
    }

    try {
      await odooGetQuiet(`/api/order/${order.id}/create_invoice`);
    } catch (e) {}

    setDraftOrderId(null);
    const freshOrder = await odooGetQuiet(`/api/order/${order.id}`);
    const orderRow = isOdooSuccess(freshOrder)
      ? odooDataList(freshOrder)[0] || order
      : order;
    let freshLines = lines;
    try {
      freshLines = await fetchOrderLines(order.id);
    } catch {
      /* keep lines from before confirm */
    }
    const cart = mapCartFromOrder(orderRow, freshLines);

    return ok({
      order_id: order.id,
      orders_id: orderRow.name || order.name,
      ...cart,
    });
  } catch (e) {
    console.error("[Odoo] placeOrder", e);
    const raw = e?.message || e?.odooPayload?.message || "place_order_failed";
    if (isOdooAccessError(raw)) {
      setDraftOrderId(null);
      return fail(CHECKOUT_SESSION_MSG);
    }
    return fail(raw);
  }
}

export async function deleteOrder({ orderId }) {
  try {
    await odooGet(`/api/order/${orderId}/update`, { state: "cancel" });
    return ok(null);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function changeOrderStatus({ orderId, status }) {
  const stateMap = {
    cancelled: "cancel",
    cancel: "cancel",
    delivered: "done",
  };
  try {
    await odooGet(`/api/order/${orderId}/update`, {
      state: stateMap[status] || status,
    });
    return ok(null);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function liveOrderTracking({ orderId }) {
  const { liveOrderTracking: track } = await import("./delivery");
  return track({ orderId });
}

export async function downloadInvoice({ orderId }) {
  const { downloadInvoice: dl } = await import("./invoices");
  return dl({ orderId });
}

export async function getMobileOrder(orderId) {
  try {
    const payload = await odooGet(`/mobile/my-order/${orderId}`);
    return ok(payload);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function removeCardItem(orderId) {
  try {
    const payload = await odooGet(`/api/order/${orderId}/remove_card_item`);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    const { getCart } = await import("./cart");
    return getCart();
  } catch (e) {
    return fail(e?.message);
  }
}
