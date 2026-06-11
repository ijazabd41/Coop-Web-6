import Cookies from "js-cookie";
import { STORAGE_KEYS } from "./config";

const COOKIE_OPTIONS = { expires: 30, path: '/' };

export function getOdooSession() {
  const sessionId = Cookies.get(STORAGE_KEYS.sessionId);
  if (!sessionId) return null;
  return {
    sessionId,
    partnerId: Number(Cookies.get(STORAGE_KEYS.partnerId)) || null,
    uid: Number(Cookies.get(STORAGE_KEYS.uid)) || null,
    draftOrderId: Number(Cookies.get(STORAGE_KEYS.draftOrderId)) || null,
    db: Cookies.get(STORAGE_KEYS.db) || null,
  };
}

export function setOdooSession(partial) {
  if (partial.sessionId != null) {
    Cookies.set(STORAGE_KEYS.sessionId, partial.sessionId, COOKIE_OPTIONS);
  }
  if (partial.partnerId != null) {
    Cookies.set(STORAGE_KEYS.partnerId, String(partial.partnerId), COOKIE_OPTIONS);
  }
  if (partial.uid != null) {
    Cookies.set(STORAGE_KEYS.uid, String(partial.uid), COOKIE_OPTIONS);
  }
  if (partial.draftOrderId != null) {
    Cookies.set(STORAGE_KEYS.draftOrderId, String(partial.draftOrderId), COOKIE_OPTIONS);
  }
  if (partial.db != null) {
    Cookies.set(STORAGE_KEYS.db, partial.db, COOKIE_OPTIONS);
  }
}

export function clearOdooSession() {
  Object.values(STORAGE_KEYS).forEach((k) => Cookies.remove(k, { path: '/' }));
  ["cd_session_id", "cd_user_id", "cd_user_name", "role_code", "cd_role_code"].forEach((k) => Cookies.remove(k, { path: '/' }));
}

export function setDraftOrderId(orderId) {
  setOdooSession({ draftOrderId: orderId });
}

export function getDraftOrderId() {
  return getOdooSession()?.draftOrderId ?? null;
}
