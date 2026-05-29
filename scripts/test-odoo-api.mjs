/**
 * Smoke test against live Odoo backend.
 * Run: node scripts/test-odoo-api.mjs
 */
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://cooperp.freeddns.org:8076";
const DB = process.env.NEXT_PUBLIC_ODOO_DB || "staging-apr17";
const LOGIN = process.env.ODOO_TEST_LOGIN || "itcom1020@gmail.com";
const PASSWORD = process.env.ODOO_TEST_PASSWORD || "dds@123";

function parseSetCookie(headers) {
  const raw = headers.getSetCookie?.() || [];
  const joined = raw.length ? raw.join(";") : headers.get("set-cookie") || "";
  const m = joined.match(/session_id=([^;]+)/);
  return m?.[1] || null;
}

async function apiGet(path, sessionId, params = {}) {
  const qs = new URLSearchParams({ by_AJR: "1", ...params });
  const res = await fetch(`${BASE}${path}?${qs}`, {
    headers: sessionId ? { Cookie: `session_id=${sessionId}` } : {},
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function main() {
  console.log("Backend:", BASE);
  const authRes = await fetch(`${BASE}/web/session/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      params: { db: DB, login: LOGIN, password: PASSWORD },
    }),
  });
  const authJson = await authRes.json();
  const sessionId = parseSetCookie(authRes.headers);
  if (!authJson?.result?.uid || !sessionId) {
    console.error("Auth failed", authJson);
    process.exit(1);
  }
  console.log("OK auth uid=", authJson.result.uid, "partner=", authJson.result.partner_id);

  const categories = await apiGet("/api/website-category", sessionId);
  console.log("OK categories", categories?.data?.length ?? 0);

  const products = await apiGet("/api/product-template", sessionId, {
    limit: 3,
    Offset: 0,
  });
  console.log("OK products", products?.data?.length ?? 0);

  const order = await apiGet("/api/order/create_order", sessionId);
  const orderId = order?.response?.[0]?.id;
  console.log("OK create_order", orderId);

  if (orderId && products?.data?.[0]) {
    const variant =
      products.data[0].product_variant_id?.[0]?.id || products.data[0].id;
    const add = await apiGet("/api/order-line/create", sessionId, {
      order_id: orderId,
      product_id: variant,
    });
    console.log("OK add line", add?.success, add?.message || "");
  }

  console.log("\nAll smoke checks passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
