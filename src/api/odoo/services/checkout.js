import { odooGet, odooGetQuiet } from "../client";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, odooDataList, ok } from "../utils";

function providerCode(p) {
  return Array.isArray(p?.code) ? p.code[0] : p?.code;
}

function extractTransactionId(txPayload) {
  const row = txPayload?.response?.[0];
  if (row?.id) return row.id;
  return txPayload?.response?.transaction_id || txPayload?.response?.id || null;
}

async function loadPaymentProviders() {
  const payload = await odooGetQuiet("/api/payment-provider", {
    domain: "[('state','in',['enabled','test'])]",
  });
  return isOdooSuccess(payload) ? odooDataList(payload) : [];
}

async function orderIsConfirmed(orderId) {
  const payload = await odooGetQuiet(`/api/order/${orderId}`);
  if (!isOdooSuccess(payload)) return false;
  const order = odooDataList(payload)[0];
  const state = Array.isArray(order?.state) ? order.state[0] : order?.state;
  return Boolean(state && state !== "draft");
}

async function confirmOrderSale(orderId) {
  const payload = await odooGetQuiet(`/api/order/${orderId}/update`, {
    state: "sale",
  });
  return isOdooSuccess(payload);
}

async function createTransaction(orderId, providerId) {
  return odooGetQuiet(`/api/order/${orderId}/get_or_create_transaction`, {
    args: `[${providerId}]`,
  });
}

function providerIdsToTry(providers, preferredId) {
  const demo = providers.find((p) => providerCode(p) === "demo");
  const ids = [];
  if (demo?.id) ids.push(demo.id);
  if (preferredId && !ids.includes(preferredId)) ids.push(preferredId);
  for (const p of providers) {
    if (p?.id && !ids.includes(p.id)) ids.push(p.id);
  }
  return ids;
}

export async function initiateTransaction({ orderId, paymentMethod }) {
  try {
    const providers = await loadPaymentProviders();
    let provider = providers.find((p) => {
      const name = (p.name || "").toLowerCase();
      if (paymentMethod === "COD") return name.includes("cash");
      return name.includes(String(paymentMethod).toLowerCase());
    });
    if (!provider) provider = providers[0];
    if (!provider?.id) return fail("no_payment_provider");

    for (const pid of providerIdsToTry(providers, provider.id)) {
      const tx = await createTransaction(orderId, pid);
      if (!isOdooSuccess(tx)) continue;
      const txId = extractTransactionId(tx);
      if (!txId) continue;
      return ok({
        transaction_id: txId,
        provider_id: pid,
        payment_url: tx?.response?.landing_route || null,
      });
    }
    return fail("payment_transaction_failed");
  } catch (e) {
    console.error("[Odoo] initiateTransaction", e);
    return fail("payment_transaction_failed");
  }
}

export async function addTransaction({ orderId, transactionId, paymentMethod }) {
  try {
    const providers = await loadPaymentProviders();
    const demo = providers.find((p) => providerCode(p) === "demo");
    const markIds = [demo?.id, providers[0]?.id].filter(
      (id, i, arr) => id && arr.indexOf(id) === i
    );

    for (const providerId of markIds) {
      const payload = await odooGetQuiet(
        `/api/order/${orderId}/order_transaction_mark_done`,
        {
          transaction_id: transactionId,
          provider_id: providerId,
        }
      );
      if (isOdooSuccess(payload)) {
        return ok({ order_id: orderId });
      }
    }
    return fail("payment_confirmation_failed");
  } catch (e) {
    return fail(e?.message || "payment_confirmation_failed");
  }
}

export async function getDeliveryMethods() {
  const { getDeliveryMethods: load } = await import("./delivery");
  return load();
}

export async function initiateTestTransaction({ orderId }) {
  try {
    if (await orderIsConfirmed(orderId)) {
      return ok({
        transaction_id: null,
        provider_id: null,
        already_confirmed: true,
      });
    }

    const providers = await loadPaymentProviders();
    for (const pid of providerIdsToTry(providers, null)) {
      const tx = await createTransaction(orderId, pid);
      if (!isOdooSuccess(tx)) continue;
      const txId = extractTransactionId(tx);
      if (txId) {
        return ok({ transaction_id: txId, provider_id: pid });
      }
    }

    if (await confirmOrderSale(orderId)) {
      return ok({
        transaction_id: null,
        provider_id: null,
        already_confirmed: true,
      });
    }

    return fail("test_payment_failed");
  } catch (e) {
    console.warn("[Odoo] initiateTestTransaction", e?.message);
    return fail("test_payment_failed");
  }
}

export async function markTestTransactionDone({
  orderId,
  transactionId,
  providerId,
}) {
  try {
    if (!transactionId) {
      if ((await orderIsConfirmed(orderId)) || (await confirmOrderSale(orderId))) {
        return ok({ order_id: orderId });
      }
      return fail("test_payment_failed");
    }

    const providers = await loadPaymentProviders();
    const demo = providers.find((p) => providerCode(p) === "demo");
    const markIds = [providerId, demo?.id].filter(
      (id, i, arr) => id && arr.indexOf(id) === i
    );

    for (const pid of markIds) {
      const payload = await odooGetQuiet(
        `/api/order/${orderId}/order_transaction_mark_done`,
        {
          transaction_id: transactionId,
          provider_id: pid,
        }
      );
      if (isOdooSuccess(payload)) {
        return ok({ order_id: orderId });
      }
    }

    if (await orderIsConfirmed(orderId)) {
      return ok({ order_id: orderId });
    }
    return fail("test_payment_failed");
  } catch (e) {
    console.warn("[Odoo] markTestTransactionDone", e?.message);
    return fail("test_payment_failed");
  }
}
