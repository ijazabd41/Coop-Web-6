/**
 * Full Odoo API catalog smoke test (all cooperp endpoints).
 * Run: node scripts/test-odoo-full.mjs
 */
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://cooperp.freeddns.org:8076";
const DB = process.env.NEXT_PUBLIC_ODOO_DB || "staging-apr17";
const LOGIN = process.env.ODOO_TEST_LOGIN || "itcom1020@gmail.com";
const PASSWORD = process.env.ODOO_TEST_PASSWORD || "dds@123";

const ENDPOINTS = [
  ["/api/website-category", {}],
  ["/api/product-category", {}],
  ["/api/product-template", { limit: 2, Offset: 0 }],
  ["/api/product", { limit: 2 }],
  ["/api/deal-day-slider", {}],
  ["/api/deal-day-slider/7", {}],
  ["/api/order", {}],
  ["/api/loyalty-program", { user_id: 2 }],
  ["/api/payment-provider", { domain: "[('state','in','enabled','test')]" }],
  ["/api/country", {}],
  ["/api/delivery-order", {}],
];

async function auth() {
  const res = await fetch(`${BASE}/web/session/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", params: { db: DB, login: LOGIN, password: PASSWORD } }),
  });
  const json = await res.json();
  const cookie = res.headers.get("set-cookie") || "";
  const m = cookie.match(/session_id=([^;]+)/);
  if (!m || !json.result?.uid) throw new Error("auth failed");
  return m[1];
}

async function get(path, sessionId, params = {}) {
  const qs = new URLSearchParams({ by_AJR: "1", ...params });
  const res = await fetch(`${BASE}${path}?${qs}`, {
    headers: { Cookie: `session_id=${sessionId}` },
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 80) };
  }
}

async function main() {
  console.log("Odoo full catalog test @", BASE);
  const sid = await auth();
  let ok = 0;
  let fail = 0;
  for (const [path, params] of ENDPOINTS) {
    const r = await get(path, sid, params);
    const success = r.success === 1 || r.success === "1";
    console.log(success ? "OK" : "WARN", path, success ? `(${r.data?.length ?? "ok"})` : r.message?.slice(0, 60));
    success ? ok++ : fail++;
  }
  const order = await get("/api/order/create_order", sid);
  console.log(order.success ? "OK" : "WARN", "/api/order/create_order");
  console.log(`\nDone: ${ok} ok, ${fail} warnings`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
