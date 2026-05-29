import axios from "axios";
import { store } from "@/redux/store";
import { logoutAuth } from "@/redux/slices/userSlice";
import {
  ODOO_API_FLAG,
  ODOO_AUTH_PATH,
  ODOO_CLIENT_BASE_URL,
} from "./config";
import { clearOdooSession, getOdooSession, setOdooSession } from "./session";
import { isOdooSuccess, unwrapOdooPayload } from "./utils";

const odooClient = axios.create({
  baseURL: ODOO_CLIENT_BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

function resolveSessionId() {
  const fromRedux = store.getState()?.User?.jwtToken;
  const fromStorage = getOdooSession()?.sessionId;
  return fromRedux || fromStorage || null;
}

/** Read session returned by the Next.js Odoo proxy. */
function captureSessionFromResponse(response) {
  const headerSession =
    response?.headers?.["x-odoo-session"] ||
    response?.headers?.["X-Odoo-Session"];
  if (headerSession) {
    setOdooSession({ sessionId: headerSession });
    return;
  }
  const setCookie = response.headers?.["set-cookie"];
  if (setCookie) {
    const joined = Array.isArray(setCookie) ? setCookie.join(";") : setCookie;
    const match = joined.match(/session_id=([^;]+)/);
    if (match?.[1]) {
      setOdooSession({ sessionId: match[1] });
    }
  }
}

odooClient.interceptors.request.use((config) => {
  const sessionId = resolveSessionId();
  // Browsers block setting Cookie manually; proxy accepts X-Odoo-Session instead.
  if (sessionId) {
    config.headers["X-Odoo-Session"] = sessionId;
  }
  config.headers.Accept = "application/json";
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

odooClient.interceptors.response.use(
  (response) => {
    captureSessionFromResponse(response);
    return response;
  },
  (error) => {
    if (error?.response) {
      captureSessionFromResponse(error.response);
    }
    if (error?.response?.status === 401) {
      clearOdooSession();
      store.dispatch(logoutAuth());
    }
    return Promise.reject(error);
  }
);

/** Append `by_AJR` to Odoo custom REST routes. */
export function withApiParams(params = {}) {
  return { by_AJR: ODOO_API_FLAG, ...params };
}

export async function odooGet(path, params = {}, options = {}) {
  const config = { params: withApiParams(params) };
  if (options.quiet) {
    config.validateStatus = (status) => status < 500;
  }
  const response = await odooClient.get(path, config);
  if (options.quiet && response.status >= 400) {
    return {
      success: 0,
      _httpStatus: response.status,
      message: `http_${response.status}`,
    };
  }
  return unwrapOdooPayload(response.data);
}

/** Same as odooGet but does not throw on 4xx (avoids console noise for optional calls). */
export async function odooGetQuiet(path, params = {}) {
  return odooGet(path, params, { quiet: true });
}

export async function odooPost(path, body = null, params = {}) {
  const { data } = await odooClient.post(path, body, {
    params: withApiParams(params),
  });
  return unwrapOdooPayload(data);
}

/** Odoo web session authenticate (JSON-RPC) via proxy. */
export async function odooAuthenticate({ login, password, db }) {
  const { data, headers } = await odooClient.post(
    ODOO_AUTH_PATH,
    {
      jsonrpc: "2.0",
      params: { db, login, password },
    },
    { headers: { "Content-Type": "application/json" } }
  );

  let sessionId =
    headers?.["x-odoo-session"] || headers?.["X-Odoo-Session"] || null;

  if (!sessionId) {
    const setCookie = headers?.["set-cookie"];
    if (setCookie) {
      const joined = Array.isArray(setCookie) ? setCookie.join(";") : setCookie;
      const match = joined.match(/session_id=([^;]+)/);
      sessionId = match?.[1] ?? null;
    }
  }

  if (data?.error) {
    return { ok: false, error: data.error?.message || "authentication_failed" };
  }

  const result = data?.result;
  if (!result?.uid || !sessionId) {
    return { ok: false, error: "invalid_credentials" };
  }

  setOdooSession({
    sessionId,
    partnerId: result.partner_id,
    uid: result.uid,
    db: result.db || db,
  });

  return { ok: true, result, sessionId };
}

export function assertOdooSuccess(payload, fallbackMessage = "odoo_request_failed") {
  if (!isOdooSuccess(payload)) {
    const err = new Error(payload?.message || fallbackMessage);
    err.odooPayload = payload;
    throw err;
  }
  return payload;
}

export default odooClient;
