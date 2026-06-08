/**
 * Legacy axios export — storefront now uses `src/api/odoo/client.js`.
 * Kept for backward compatibility; forwards session cookie from Redux/storage.
 */
import odooClient, { withApiParams } from "./odoo/client";
import { store } from "@/redux/store";
import { logoutAuth } from "@/redux/slices/userSlice";
import { getOdooSession } from "./odoo/session";

const api = odooClient;

api.interceptors.request.use(async (config) => {
  const authToken =
    store.getState()?.User?.jwtToken || getOdooSession()?.sessionId;
  if (authToken) {
    config.headers["X-Odoo-Session"] = authToken;
  }
  const language = store.getState()?.Language?.selectedLanguage;
  if (language?.code) {
    config.headers["Content-Language"] = language.code;
  }
  if (config.params) {
    config.params = withApiParams(config.params);
  } else if (config.url?.includes("/api/")) {
    config.params = withApiParams();
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logoutAuth());
    }
    console.error("[API]", error?.message || error);
    return Promise.reject(error);
  }
);

export default api;
