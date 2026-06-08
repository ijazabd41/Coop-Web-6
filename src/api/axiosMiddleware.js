/**
 * Legacy axios export — storefront now uses `src/api/odoo/client.js`.
 * Kept for backward compatibility; forwards session cookie from Redux/storage.
 */
import odooClient, { withApiParams } from "./odoo/client";
import { store } from "@/redux/store";
import { logoutAuth, setJWTToken, setCurrentUser } from "@/redux/slices/userSlice";
import { setCart, setCartProducts, setCartSubTotal, clearCartPromo, setIsGuest } from "@/redux/slices/cartSlice";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
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
      store.dispatch(clearAllFilter());
      store.dispatch(logoutAuth());
      store.dispatch(setJWTToken({ data: "" }));
      store.dispatch(setCurrentUser({ data: null }));
      store.dispatch(setCart({ data: [] }));
      store.dispatch(setCartProducts({ data: [] }));
      store.dispatch(setCartSubTotal({ data: 0 }));
      store.dispatch(clearCartPromo());
      store.dispatch(setIsGuest({ data: true }));
      
      try {
        localStorage.removeItem("role_code");
        localStorage.removeItem("cd_role_code");
        localStorage.removeItem("cd_session_id");
        localStorage.removeItem("cd_user_id");
        localStorage.removeItem("cd_user_name");
      } catch (e) {}
    }
    console.error("[API]", error?.message || error);
    return Promise.reject(error);
  }
);

export default api;
