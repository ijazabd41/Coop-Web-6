import { odooGet } from "../client";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, odooDataList, ok } from "../utils";

export async function getDeliveryMethods() {
  try {
    const uid = getOdooSession()?.uid || 2;
    const payload = await odooGet("/api/delivery-method", { user_id: uid });
    if (!isOdooSuccess(payload)) return ok([]);
    return ok(
      odooDataList(payload).map((d) => ({
        id: d.id,
        name: d.name || d.display_name,
        price: d.fixed_price || d.price || 0,
        carrier_id: d.carrier_id ? (Array.isArray(d.carrier_id) ? d.carrier_id[0] : d.carrier_id) : d.id,
      }))
    );
  } catch {
    return ok([]);
  }
}

export async function listDeliveryOrders({ domain, orderId } = {}) {
  try {
    const params = {};
    if (domain) params.domain = domain;
    if (orderId) params.domain = `[('sale_id','=',${orderId})]`;
    const payload = await odooGet("/api/delivery-order", params);
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(
      odooDataList(payload).map((d) => ({
        id: d.id,
        name: d.name || d.display_name,
        state: Array.isArray(d.state) ? d.state[0] : d.state,
        note: d.note,
        sale_id: Array.isArray(d.sale_id) ? d.sale_id[0] : d.sale_id,
      }))
    );
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getDeliveryOrder(id) {
  const payload = await odooGet(`/api/delivery-order/${id}`);
  if (!isOdooSuccess(payload)) return fail(payload?.message);
  return ok(odooDataList(payload)[0]);
}

export async function updateDeliveryOrder(id, params) {
  const payload = await odooGet(`/api/delivery-order/${id}/update`, params);
  if (!isOdooSuccess(payload)) return fail(payload?.message);
  return ok(null);
}

/** Unassigned deliveries available for riders */
export async function listRiderDeliveries({ limit = 10, offset = 0 } = {}) {
  try {
    const payload = await odooGet("/api/rider-delivery", {
      limit,
      offset,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(odooDataList(payload));
  } catch (e) {
    return fail(e?.message);
  }
}

/** Rider's own assigned deliveries */
export async function listRiderOwnDeliveries({
  userId,
  limit = 10,
  offset = 0,
} = {}) {
  const uid = userId || getOdooSession()?.uid;
  if (!uid) return fail("not_authenticated");
  try {
    const payload = await odooGet("/api/rider-own-delivery", {
      domain: `[('user_id','=',${uid})]`,
      limit,
      offset,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(odooDataList(payload));
  } catch (e) {
    return fail(e?.message);
  }
}

/** Rider accepts an unassigned delivery */
export async function acceptRiderDelivery(deliveryId, userId) {
  const uid = userId || getOdooSession()?.uid;
  try {
    const payload = await odooGet(`/api/rider-delivery/${deliveryId}/update`, {
      user_id: uid,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(null);
  } catch (e) {
    return fail(e?.message);
  }
}

/** Rider marks delivery done */
export async function markRiderDeliveryDone(deliveryId, userId) {
  const uid = userId || getOdooSession()?.uid;
  try {
    const payload = await odooGet(
      `/api/rider-own-delivery/${deliveryId}/mark_done`,
      { uid }
    );
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(payload.data || payload);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function updateRiderDelivery(id, params) {
  return acceptRiderDelivery(id, params?.user_id);
}

export async function submitDeliveryFeedback({
  userId,
  pickingId,
  feedback,
  rating,
}) {
  try {
    const payload = await odooGet("/delivery-feedback", {
      user_id: userId,
      picking_id: pickingId,
      feedback,
      rating: rating ?? "",
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(null);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function liveOrderTracking({ orderId }) {
  const res = await listDeliveryOrders({ orderId });
  if (res.status !== 1) return res;
  const delivery = res.data[0];
  if (!delivery) return ok({ latitude: null, longitude: null, status: "" });
  const detail = await getDeliveryOrder(delivery.id);
  const row = detail.data || delivery;
  return ok({
    latitude: row.partner_latitude || row.latitude,
    longitude: row.partner_longitude || row.longitude,
    status: Array.isArray(row.state) ? row.state[1] : row.state,
    delivery_id: delivery.id,
  });
}
