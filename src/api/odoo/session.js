import { STORAGE_KEYS } from "./config";

function safeStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export function getOdooSession() {
  const ls = safeStorage();
  if (!ls) return null;
  const sessionId = ls.getItem(STORAGE_KEYS.sessionId);
  if (!sessionId) return null;
  return {
    sessionId,
    partnerId: Number(ls.getItem(STORAGE_KEYS.partnerId)) || null,
    uid: Number(ls.getItem(STORAGE_KEYS.uid)) || null,
    draftOrderId: Number(ls.getItem(STORAGE_KEYS.draftOrderId)) || null,
    db: ls.getItem(STORAGE_KEYS.db) || null,
  };
}

export function setOdooSession(partial) {
  const ls = safeStorage();
  if (!ls) return;
  if (partial.sessionId != null) {
    ls.setItem(STORAGE_KEYS.sessionId, partial.sessionId);
  }
  if (partial.partnerId != null) {
    ls.setItem(STORAGE_KEYS.partnerId, String(partial.partnerId));
  }
  if (partial.uid != null) {
    ls.setItem(STORAGE_KEYS.uid, String(partial.uid));
  }
  if (partial.draftOrderId != null) {
    ls.setItem(STORAGE_KEYS.draftOrderId, String(partial.draftOrderId));
  }
  if (partial.db != null) {
    ls.setItem(STORAGE_KEYS.db, partial.db);
  }
}

export function clearOdooSession() {
  const ls = safeStorage();
  if (!ls) return;
  Object.values(STORAGE_KEYS).forEach((k) => ls.removeItem(k));
}

export function setDraftOrderId(orderId) {
  setOdooSession({ draftOrderId: orderId });
}

export function getDraftOrderId() {
  return getOdooSession()?.draftOrderId ?? null;
}
