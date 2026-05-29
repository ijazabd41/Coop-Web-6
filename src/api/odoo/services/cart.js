import { odooGet } from "../client";
import { store } from "@/redux/store";
import {
  mapCartFromOrder,
  mapOrderLine,
  mapProductTemplate,
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
      if (isOdooSuccess(check) && row && orderState(row) === "draft") {
        return row;
      }
      setDraftOrderId(null);
    } catch {
      setDraftOrderId(null);
    }
  }

  if (partnerId) {
    const draft = await fetchDraftOrder(partnerId);
    if (draft?.id) {
      setDraftOrderId(draft.id);
      return draft;
    }
  }

  const created = await odooGet("/api/order/create_order");
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

/** Map order lines and backfill image_url from product template when missing. */
export async function buildOrderItemsWithImages(lines, orderActiveStatus = 2) {
  const items = [];
  for (const line of lines) {
    let item = mapOrderLine(line, orderActiveStatus);
    const ref = embeddedRecord(line.product_id);
    const tmplId = m2oId(ref?.product_tmpl_id);
    const variantId = item.product_variant_id || m2oId(line.product_id);
    const img = String(item.image_url || "");
    const needsImage =
      !img ||
      img.includes("/api/odoo/") ||
      img.includes("/image_1024") ||
      img.includes("/api/odoo/api/");
    if (needsImage && (tmplId || variantId)) {
      try {
        if (tmplId) {
          const payload = await odooGet(`/api/bcp-product-template/${tmplId}`);
          const tpl = odooDataList(payload)[0];
          if (tpl) {
            item = { ...item, image_url: mapProductTemplate(tpl).image_url };
          }
        } else if (variantId) {
          const payload = await odooGet("/api/bcp-product-template", {
            domain: `[('product_variant_id','in',[${variantId}])]`,
            limit: 1,
          });
          const tpl = odooDataList(payload)[0];
          if (tpl) {
            item = { ...item, image_url: mapProductTemplate(tpl).image_url };
          }
        }
      } catch {
        /* optional enrichment */
      }
    }
    items.push(item);
  }
  return items;
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
    const cart = mapCartFromOrder(order, lines, cartItems);
    return ok(cart);
  } catch (e) {
    console.error("[Odoo] getCart", e);
    return fail(e?.message);
  }
}

export async function addToCart({ product_variant_id, qty = 1 }) {
  try {
    const session = getOdooSession();
    if (!session?.sessionId) {
      return fail("not_authenticated");
    }

    const order = await getOrCreateDraftOrder();
    if (!order?.id) return fail("cart_unavailable");

    let variantId = Number(product_variant_id);
    if (!variantId) return fail("invalid_variant");

    const payload = await odooGet("/api/order-line/create", {
      order_id: order.id,
      product_id: variantId,
      product_uom_qty: 1,
    });

    if (!isOdooSuccess(payload)) {
      return fail(payload?.message || "add_to_cart_failed");
    }

    const lineId =
      payload.response?.[0]?.id ||
      odooDataList(payload)[0]?.id;
    if (lineId && qty > 1) {
      await odooGet(`/api/order-line/${lineId}/update`, {
        product_uom_qty: qty,
      });
    }

    return getCart();
  } catch (e) {
    console.error("[Odoo] addToCart", e);
    return fail(e?.message);
  }
}

export async function removeFromCart({
  product_variant_id,
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

    const line = lines.find(
      (l) => m2oIdLine(l) === Number(product_variant_id)
    );
    if (line) {
      await odooGet(`/api/order/${order.id}/remove_card_item`, {
        line_ids: `[${line.id}]`
      });
    }
    return getCart();
  } catch (e) {
    console.error("[Odoo] removeFromCart", e);
    return fail(e?.message);
  }
}

function m2oIdLine(line) {
  const p = line.product_id;
  return Array.isArray(p) ? p[0] : p?.id;
}

export async function updateCartLineQty({ lineId, qty }) {
  const payload = await odooGet(`/api/order-line/${lineId}/update`, {
    product_uom_qty: qty,
  });
  if (!isOdooSuccess(payload)) return fail(payload?.message);
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
      if (!product) {
        const tpl = await odooGet(`/api/bcp-product-template/${variantId}`);
        product = odooDataList(tpl)[0];
        if (product) {
          const mapped = mapProductTemplate(product);
          cart.push({
            ...mapOrderLine({
              id: i,
              product_id: [variantId, mapped.name],
              product_uom_qty: Number(qtys[i]) || 1,
              price_unit: mapped.variants?.[0]?.price || 0,
              price_subtotal:
                (mapped.variants?.[0]?.price || 0) * (Number(qtys[i]) || 1),
              name: mapped.name,
            }),
            product_id: mapped.id,
            product_variant_id: variantId,
          });
          continue;
        }
      }
      const qty = Number(qtys[i]) || 1;
      const price = Number(product?.lst_price || product?.list_price || 0);
      const image_url =
        imageFromOdooRecord(product, "product.product", variantId) ||
        odooWebImageUrl("product.product", variantId, "image_1920");
      cart.push({
        product_id: variantId,
        product_variant_id: variantId,
        name: product?.display_name || product?.name,
        qty,
        price,
        discounted_price: price,
        sub_total: price * qty,
        image_url,
      });
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
