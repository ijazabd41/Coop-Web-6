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
import { invalidateCache } from "../requestCache";

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
    invalidateCache("/api/order");
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
  cartProducts,
  deliveryTime,
}) {
  try {
    const session = getOdooSession();
    
    // Step 1: Order Initialization
    const order = await getOrCreateDraftOrder();
    if (!order?.id) return fail("no_cart");

    // Step 2: Cart Synchronization
    const oldLines = await fetchOrderLines(order.id);
    if (oldLines.length > 0) {
      const lineIds = oldLines.map((l) => l.id);
      await odooGet(`/api/order/${order.id}/remove_card_item`, {
        line_ids: JSON.stringify(lineIds)
      });
    }

    if (cartProducts && cartProducts.length > 0) {
      for (const item of cartProducts) {
        const payload = await odooGet("/api/order-line/create", {
          order_id: order.id,
          product_id: item.product_variant_id || item.product_id,
        });
        const lineId = payload.response?.[0]?.id || odooDataList(payload)[0]?.id || payload.data?.rec_id;
        if (lineId && item.qty > 1) {
          await odooGet(`/api/order-line/${lineId}/update`, {
            product_uom_qty: item.qty,
          });
        }
      }
    } else {
      return fail("empty_cart");
    }

    // Step 3: Rewards & Discounts
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

    // Step 4: Attach Delivery & Addresses
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
      } catch {}
    }

    const updateParams = {
      origin: "COOPDISCOUNT-WEB",
      partner_shipping_id: partners.partner_shipping_id,
      partner_invoice_id: partners.partner_invoice_id,
    };
    if (resolvedCarrierId) updateParams.carrier_id = resolvedCarrierId;
    
    await odooGet(`/api/order/${order.id}/update`, updateParams);

    // Step 5: Attach Final Notes & Payment Method String
    const finalNote = `[DELIVERY] ${deliveryTime || ""} | Payment Method: ${paymentMethod} | ${orderNote || ""}`.trim();
    await odooGet(`/api/order/${order.id}/update`, { note: finalNote });

    // Block/pause based on payment provider type
    const method = String(paymentMethod || "").toUpperCase();
    const isCOD = method === "COD" || method === "CASH";
    const isSynchronous = isCOD || method === "WALLET" || method === "TEST PAYMENT";

    if (isCOD) {
      // According to documentation, COD doesn't have a gateway callback.
      // We skip the transaction API entirely and confirm the order directly.
      await odooGetQuiet(`/api/order/${order.id}/update`, { state: "sale" });
    } else {
      // Step 6: Initialize Payment Transaction for Gateways & Wallets
      const payPayload = await odooGet("/api/payment-provider", {
        domain: "[('state','in',['enabled','test'])]",
      });
      const providers = odooDataList(payPayload);
      const provider = resolveProvider(providers, paymentMethod);
      let providerId = provider?.id;

      if (!providerId) return fail("no_payment_provider");

      if (isSynchronous) {
        const demo = providers.find((p) => providerCode(p) === "demo" || String(p.name).toLowerCase().includes("demo"));
        if (demo?.id) {
          providerId = demo.id;
        }
      }

      let txPayload = await odooGetQuiet(`/api/order/${order.id}/get_or_create_transaction`, {
        args: `[${providerId}]`
      });
      let transactionId = extractTransactionId(txPayload);

      if (!isSynchronous) {
        // Pause here and return tx details to frontend for external providers
        setDraftOrderId(null);
        invalidateCache("/api/order");
        return ok({
          order_id: order.id,
          transaction_id: transactionId,
          provider_id: providerId,
          redirectUrl: txPayload?.response?.landing_route || txPayload?.response?.redirectUrl || null,
          client_secret: txPayload?.response?.client_secret || txPayload?.response?.[0]?.client_secret || null,
          id: transactionId
        });
      }

      // Step 7: Confirm Order (Mark Done) for Synchronous Gateways/Wallets
      if (transactionId) {
        await odooGetQuiet(`/api/order/${order.id}/order_transaction_mark_done`, {
          transaction_id: transactionId,
          args: `[${providerId}]`,
        });
      }
    }

    // Step 8: Generate Invoice
    try {
      await odooGetQuiet(`/api/order/${order.id}/create_invoice`);
    } catch (e) {}

    setDraftOrderId(null);
    invalidateCache("/api/order");

    return ok({ order_id: order.id });
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
