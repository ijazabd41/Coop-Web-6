import { odooGet } from "../client";
import { invalidateCache } from "../requestCache";
import { store } from "@/redux/store";
import {
  mapCartFromOrder,
  mapOrderLine,
  mapProductTemplate,
  resolveVariantId,
} from "../mappers";
import { embeddedRecord, imageFromOdooRecord, imageUrl, m2oId, odooWebImageUrl } from "../utils";
import {
  getDraftOrderId,
  getOdooSession,
  setDraftOrderId,
  setOdooSession,
} from "../session";
import {
  encodeDomain,
  fail,
  isOdooSuccess,
  odooDataList,
  ok,
} from "../utils";

function orderState(order) {
  const state = order?.state;
  return Array.isArray(state) ? state[0] : state;
}

function orderPartnerId(order) {
  return m2oId(order?.partner_id) || m2oId(order?.partner_shipping_id);
}

function draftBelongsToPartner(order, partnerId) {
  if (!partnerId) return true;
  const owner = orderPartnerId(order);
  return !owner || owner === partnerId;
}

function extractOrderId(payload) {
  if (!payload) return null;
  const candidates = [
    payload.response?.[0]?.id,
    payload.response?.id,
    odooDataList(payload)[0]?.id,
    payload.data?.[0]?.id,
    payload.data?.id,
  ];
  for (const id of candidates) {
    const n = Number(id);
    if (n > 0) return n;
  }
  return null;
}

/** Restore partner id from Redux user when localStorage lost it after refresh. */
function ensurePartnerId() {
  const session = getOdooSession();
  if (session?.partnerId) return session.partnerId;

  const reduxUser = store.getState()?.User?.user;
  const partnerId = Number(reduxUser?.partner_id || reduxUser?.id) || null;
  if (partnerId) {
    setOdooSession({
      partnerId,
      uid: session?.uid || reduxUser?.uid || undefined,
    });
    return partnerId;
  }
  return null;
}

async function fetchDraftOrder(partnerId) {
  const domain = `[('partner_id','=',${partnerId}),('state','=','draft')]`;
  const payload = await odooGet("/api/order", { domain });
  const orders = odooDataList(payload);
  return orders.sort((a, b) => b.id - a.id)[0] || null;
}

export async function getOrCreateDraftOrder() {
  const session = getOdooSession();
  if (!session?.sessionId) return null;

  const partnerId = ensurePartnerId();

  let orderId = getDraftOrderId();
  if (orderId) {
    try {
      const check = await odooGet(`/api/order/${orderId}`);
      const row = odooDataList(check)[0];
      if (
        isOdooSuccess(check) &&
        row &&
        orderState(row) === "draft" &&
        draftBelongsToPartner(row, partnerId)
      ) {
        return row;
      }
      setDraftOrderId(null);
    } catch {
      setDraftOrderId(null);
    }
  }

  if (partnerId) {
    const draft = await fetchDraftOrder(partnerId);
    if (draft?.id && draftBelongsToPartner(draft, partnerId)) {
      setDraftOrderId(draft.id);
      return draft;
    }
  }

  const createParams = {
    sources: "COOPDISCOUNT-WEB",
    website_id: process.env.NEXT_PUBLIC_WEBSITE_ID || 1,
  };
  if (partnerId) {
    createParams.partner_id = partnerId;
  }
  const created = await odooGet("/api/order/create_order", createParams);
  if (!isOdooSuccess(created)) {
    throw new Error(created?.message || "create_order_failed");
  }
  const newId = extractOrderId(created);
  if (!newId) {
    throw new Error("create_order_failed");
  }
  setDraftOrderId(newId);

  const orderPayload = await odooGet(`/api/order/${newId}`);
  const order = odooDataList(orderPayload)[0] || { id: newId };

  if (!partnerId) {
    const orderPartner =
      m2oId(order.partner_id) || m2oId(order.partner_shipping_id);
    if (orderPartner) {
      setOdooSession({ partnerId: orderPartner });
    }
  }

  return order;
}

export async function fetchOrderLines(orderId) {
  const domain = `[('order_id','=',${orderId})]`;
  const payload = await odooGet("/api/order-line", { domain });
  return odooDataList(payload);
}

export async function buildOrderItemsWithImages(lines, orderActiveStatus = 2) {
  return lines.map((line) => mapOrderLine(line, orderActiveStatus));
}

export async function getCart() {
  const session = getOdooSession();
  if (!session?.sessionId) {
    return fail("not_authenticated");
  }
  try {
    const order = await getOrCreateDraftOrder();
    if (!order?.id) return ok({ cart: [], sub_total: 0, total_amount: 0 });
    const lines = await fetchOrderLines(order.id);
    const cartItems = await buildOrderItemsWithImages(lines);

    let orderTotals = order;
    try {
      const freshOrderPayload = await odooGet(`/api/order/${order.id}`);
      orderTotals = odooDataList(freshOrderPayload)[0] || order;
    } catch {
      /* use draft order snapshot */
    }

    const cart = mapCartFromOrder(orderTotals, lines, cartItems);
    return ok(cart);
  } catch (e) {
    console.error("[Odoo] getCart", e);
    return fail(e?.message);
  }
}

async function resolveOdooProductId(productId) {
  const id = Number(productId);
  if (!id) return null;

  try {
    const variantPayload = await odooGet("/api/product", {
      domain: `[('id','=',${id})]`,
      limit: 1,
    });
    if (odooDataList(variantPayload).length > 0) return id;
  } catch {
    /* not a product.product id */
  }

  try {
    const tplPayload = await odooGet(`/api/bcp-product-template/${id}`);
    const template = odooDataList(tplPayload)[0];
    if (template) {
      const variantId = resolveVariantId(template);
      if (variantId) return variantId;
    }
  } catch {
    /* fall through */
  }

  return id;
}

function lineProductRef(line) {
  const raw = line?.product_id;
  if (Array.isArray(raw) && raw[0] && typeof raw[0] === "object") return raw[0];
  if (raw && typeof raw === "object") return raw;
  return null;
}

function findExistingOrderLine(lines, variantId, templateId) {
  for (const line of lines) {
    const lineVariantId = m2oIdLine(line);
    if (variantId && lineVariantId === variantId) return line;
    if (templateId && lineVariantId === templateId) return line;

    const productRef = lineProductRef(line);
    const tmplId = m2oId(productRef?.product_tmpl_id);
    if (templateId && tmplId === templateId) return line;
    if (variantId && tmplId === variantId) return line;
  }
  return null;
}

export async function addToCart({
  product_variant_id,
  product_id,
  qty = 1,
}) {
  try {
    const session = getOdooSession();
    if (!session?.sessionId) {
      return fail("not_authenticated");
    }

    const order = await getOrCreateDraftOrder();
    if (!order?.id) return fail("cart_unavailable");

    const templateId = product_id ? Number(product_id) : null;
    const requestedId = Number(product_variant_id || product_id);
    if (!requestedId) return fail("invalid_variant");

    const variantId = await resolveOdooProductId(requestedId);
    if (!variantId) return fail("invalid_variant");

    const lines = await fetchOrderLines(order.id);
    const existingLine = findExistingOrderLine(lines, variantId, templateId);
    const addQty = Number(qty) || 1;

    if (existingLine?.id) {
      const existingQty = Number(existingLine.product_uom_qty) || 0;
      const requestedQty = addQty;
      const newQty =
        requestedQty > existingQty
          ? requestedQty
          : requestedQty < existingQty
            ? requestedQty
            : existingQty + requestedQty;
      await odooGet(`/api/order-line/${existingLine.id}/update`, {
        product_uom_qty: newQty,
      });
    } else {
      const payload = await odooGet("/api/order-line/create", {
        order_id: order.id,
        product_id: variantId,
      });

      if (!isOdooSuccess(payload)) {
        return fail(payload?.message || "add_to_cart_failed");
      }

      const lineId =
        payload.response?.[0]?.id ||
        odooDataList(payload)[0]?.id ||
        payload.data?.rec_id;

      if (lineId && addQty !== 1) {
        await odooGet(`/api/order-line/${lineId}/update`, {
          product_uom_qty: addQty,
        });
      }
    }

    invalidateCache("/api/order");
    return getCart();
  } catch (e) {
    console.error("[Odoo] addToCart", e);
    return fail(e?.message);
  }
}

export async function removeFromCart({
  product_variant_id,
  product_id,
  isRemoveAll = 0,
}) {
  try {
    const order = await getOrCreateDraftOrder();
    if (!order?.id) return ok({ cart: [], sub_total: 0 });

    const lines = await fetchOrderLines(order.id);
    if (isRemoveAll === 1) {
      const lineIds = lines.map((l) => l.id);
      if (lineIds.length > 0) {
        try {
          await odooGet(`/api/order/${order.id}/remove_card_item`, {
            line_ids: JSON.stringify(lineIds)
          });
        } catch (err) {
          console.warn("[Odoo] remove all lines", err?.message);
        }
      }
      setDraftOrderId(null);
      const fresh = await odooGet("/api/order/create_order");
      const newId = extractOrderId(fresh);
      if (newId) setDraftOrderId(newId);
      return ok({ cart: [], sub_total: 0, total_amount: 0 });
    }

    const templateId = product_id ? Number(product_id) : null;
    const requestedId = Number(product_variant_id || product_id);
    const variantId = requestedId
      ? await resolveOdooProductId(requestedId)
      : null;
    const line = findExistingOrderLine(lines, variantId, templateId);
    if (line) {
      await odooGet(`/api/order/${order.id}/remove_card_item`, {
        line_ids: `[${line.id}]`
      });
    }
    invalidateCache("/api/order");
    return getCart();
  } catch (e) {
    console.error("[Odoo] removeFromCart", e);
    return fail(e?.message);
  }
}

function m2oIdLine(line) {
  const p = line.product_id;
  if (Array.isArray(p)) {
    if (p[0] && typeof p[0] === "object") return Number(p[0].id) || 0;
    return Number(p[0]) || 0;
  }
  if (p && typeof p === "object") return Number(p.id) || 0;
  return Number(p) || 0;
}

export async function updateCartLineQty({ lineId, qty }) {
  const payload = await odooGet(`/api/order-line/${lineId}/update`, {
    product_uom_qty: qty,
  });
  if (!isOdooSuccess(payload)) return fail(payload?.message);
  invalidateCache("/api/order");
  return getCart();
}

/** Fetch line quantity details (Odoo order-line-qty endpoint). */
export async function getOrderLineQty(lineId) {
  try {
    const payload = await odooGet(`/api/order-line-qty/${lineId}`);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(odooDataList(payload)[0] || payload.data);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getGuestCart({ variant_ids, quantities }) {
  try {
    const vIds = String(variant_ids).split(",").filter(Boolean);
    const qtys = String(quantities).split(",").filter(Boolean);
    const cart = [];

    for (let i = 0; i < vIds.length; i++) {
      const variantId = vIds[i];
      const payload = await odooGet("/api/product", {
        domain: `[('id','=',${variantId})]`,
      });
      let product = odooDataList(payload)[0];
      
      let templatePayload;
      if (product && product.product_tmpl_id) {
        const tmplId = Array.isArray(product.product_tmpl_id) ? product.product_tmpl_id[0] : product.product_tmpl_id;
        templatePayload = await odooGet(`/api/bcp-product-template/${tmplId}`);
      } else {
        templatePayload = await odooGet(`/api/bcp-product-template/${variantId}`);
      }
      
      const tplRecord = templatePayload ? odooDataList(templatePayload)[0] : null;
      if (tplRecord) {
        const mapped = mapProductTemplate(tplRecord);
        const variantData = mapped.variants?.find((v) => v.id == variantId) || mapped.variants?.[0] || mapped;
        const qty = Number(qtys[i]) || 1;
        const finalPrice = variantData.discounted_price !== undefined ? variantData.discounted_price : (variantData.price || 0);
        
        cart.push({
          ...mapOrderLine({
            id: i,
            product_id: [variantId, mapped.name],
            product_uom_qty: qty,
            price_unit: finalPrice,
            price_subtotal: finalPrice * qty,
            name: mapped.name,
          }),
          product_id: mapped.id,
          product_variant_id: variantId,
          price: variantData.price || 0,
          discounted_price: finalPrice,
          sub_total: finalPrice * qty,
        });
      }
    }

    const sub_total = cart.reduce((s, c) => s + Number(c.sub_total || 0), 0);
    return ok({ cart, sub_total });
  } catch (e) {
    console.error("[Odoo] getGuestCart", e);
    return fail(e?.message);
  }
}

export async function bulkAddToCart({ variant_ids, quantities }) {
  const vIds = String(variant_ids).split(",");
  const qtys = String(quantities).split(",");
  for (let i = 0; i < vIds.length; i++) {
    await addToCart({
      product_variant_id: vIds[i],
      qty: Number(qtys[i]) || 1,
    });
  }
  return getCart();
}
