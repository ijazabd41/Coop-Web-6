import { odooGet } from "../client";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, odooDataList, ok } from "../utils";

export async function initiateTransaction({ orderId, paymentMethod }) {
  try {
    const payPayload = await odooGet("/api/payment-provider", {
      domain: "[('state','in',['enabled','test'])]",
    });
    const providers = odooDataList(payPayload);
    let provider = providers.find((p) => {
      const name = (p.name || "").toLowerCase();
      if (paymentMethod === "COD") return name.includes("cash");
      return name.includes(String(paymentMethod).toLowerCase());
    });
    if (!provider) provider = providers[0];
    if (!provider?.id) return fail("no_payment_provider");

    const tx = await odooGet(
      `/api/order/${orderId}/get_or_create_transaction`,
      { args: `[${provider.id}]` }
    );
    if (!isOdooSuccess(tx)) return fail(tx?.message);
    const txId =
      tx?.data?.id ||
      tx?.response?.[0]?.id ||
      tx?.response?.transaction_id ||
      tx?.response?.id;
    return ok({
      transaction_id: txId,
      provider_id: provider.id,
      payment_url: tx?.response?.landing_route || null,
    });
  } catch (e) {
    console.error("[Odoo] initiateTransaction", e);
    return fail(e?.message);
  }
}

export async function addTransaction({ orderId, transactionId, paymentMethod }) {
  try {
    const payload = await odooGet(
      `/api/order/${orderId}/order_transaction_mark_done`,
      {
        args: `[${transactionId}]`,
        transaction_id: transactionId,
      }
    );
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok({ order_id: orderId });
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getDeliveryMethods() {
  try {
    const uid = getOdooSession()?.uid || 2;
    const payload = await odooGet("/api/delivery-method", { user_id: uid });
    if (!isOdooSuccess(payload)) return ok([]);
    return ok(
      odooDataList(payload).map((d) => ({
        id: d.id,
        name: d.name || d.display_name,
        price: d.fixed_price || 0,
      }))
    );
  } catch {
    return ok([]);
  }
}

export async function initiateTestTransaction({ orderId }) {
  try {
    const tx = await odooGet(`/api/order/${orderId}/get_or_create_transaction`, { args: `[6]` });
    if (isOdooSuccess(tx)) {
      const txId = tx?.data?.id || tx?.response?.[0]?.id || tx?.response?.transaction_id || tx?.response?.id;
      if (txId) {
        return ok({ transaction_id: txId, provider_id: 6 });
      }
    }
    return fail(tx?.message || "Failed to create test transaction.");
  } catch (e) {
    const errBody = e?.response?.data ? JSON.stringify(e.response.data) : null;
    console.warn(`[Odoo] initiateTestTransaction attempt failed`, errBody || e?.message);
    return fail(errBody || e?.message || "Failed to create test transaction.");
  }
}

export async function markTestTransactionDone({ orderId, transactionId }) {
  try {
    const payload = await odooGet(`/api/order/${orderId}/order_transaction_mark_done`, {
      provider_id: 6,
      transaction_id: transactionId
    });
    if (isOdooSuccess(payload)) {
      return ok({ order_id: orderId });
    }
    return fail(payload?.message || "Test mark_done failed.");
  } catch (e) {
    const errBody = e?.response?.data ? JSON.stringify(e.response.data) : null;
    console.warn(`[Odoo] markTestTransactionDone attempt failed`, errBody || e?.message);
    return fail(errBody || e?.message || "Test mark_done failed.");
  }
}

