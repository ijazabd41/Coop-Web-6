/**
 * Integration smoke test against Coop ERP APIs (same backend as website + admin).
 * Run: node scripts/test-odoo-integration.mjs
 */
import "dotenv/config";

const ODOO_BASE = (
  process.env.ODOO_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://cooperp.freeddns.org:8076"
).replace(/\/$/, "");

const DB = process.env.NEXT_PUBLIC_ODOO_DB || "staging-apr17";
const LOGIN = process.env.ODOO_TEST_LOGIN || "itcom1020@gmail.com";
const PASSWORD = process.env.ODOO_TEST_PASSWORD || "dds@123";

let sessionId = null;
const results = [];

function log(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

async function odooFetch(path, { params = {}, method = "GET" } = {}) {
  const url = new URL(path.startsWith("http") ? path : `${ODOO_BASE}${path}`);
  url.searchParams.set("by_AJR", "1");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const headers = { Accept: "application/json" };
  if (sessionId) headers.Cookie = `session_id=${sessionId}`;
  const res = await fetch(url, { method, headers });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const m = setCookie.match(/session_id=([^;]+)/);
    if (m) sessionId = m[1];
  }
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 200) };
  }
  return { status: res.status, data };
}

async function authenticate() {
  const res = await fetch(`${ODOO_BASE}/web/session/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      params: { db: DB, login: LOGIN, password: PASSWORD },
    }),
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const m = setCookie.match(/session_id=([^;]+)/);
    if (m) sessionId = m[1];
  }
  const data = await res.json();
  const ok = Boolean(data?.result?.uid && sessionId);
  log("Odoo authenticate", ok, ok ? `uid=${data.result.uid}` : JSON.stringify(data?.error || data));
  return ok ? data.result : null;
}

async function main() {
  console.log(`\nOdoo base: ${ODOO_BASE}  db: ${DB}\n`);

  const user = await authenticate();
  if (!user) {
    console.log("\nCannot continue without session.\n");
    process.exit(1);
  }

  const partnerId = user.partner_id;

  // Loyalty coupons for partner
  const coupons = await odooFetch("/api/loyalty-coupon", {
    params: { domain: `[('partner_id','=',${partnerId})]` },
  });
  const couponList = coupons.data?.data || [];
  log(
    "GET loyalty-coupon (partner)",
    coupons.data?.success == 1,
    `count=${couponList.length}`
  );

  // Loyalty by code (sample from Postman)
  const byCode = await odooFetch("/api/loyalty-coupon", {
    params: { domain: `[('code','=','0441-0084-44db')]` },
  });
  log(
    "GET loyalty-coupon (by code)",
    byCode.data?.success == 1,
    byCode.data?.data?.[0]?.code || byCode.data?.message || ""
  );

  // Loyalty reward
  const rewardId =
    couponList[0]?.program_id?.[0]?.reward_ids?.[0]?.id || 6;
  const reward = await odooFetch(`/api/loyalty-reward/${rewardId}`, {
    params: { user_id: user.uid },
  });
  log("GET loyalty-reward", reward.data?.success == 1, `id=${rewardId}`);

  // Contacts list
  const contacts = await odooFetch("/api/contacts", {
    params: {
      domain: `[('parent_id','=',${partnerId}),('type','in',['delivery','invoice'])]`,
      limit: 20,
      offset: 0,
    },
  });
  log(
    "GET contacts (delivery/invoice)",
    contacts.data?.success == 1,
    `count=${(contacts.data?.data || []).length}`
  );

  // Draft order
  const created = await odooFetch("/api/order/create_order");
  const orderId =
    created.data?.response?.[0]?.id ||
    created.data?.data?.[0]?.id ||
    created.data?.response?.id;
  log("POST create_order", created.data?.success == 1, `orderId=${orderId}`);

  if (orderId) {
    const shipId =
      (contacts.data?.data || []).find((c) =>
        Array.isArray(c.type) ? c.type[0] === "delivery" : c.type === "delivery"
      )?.id || partnerId;

    const invId =
      (contacts.data?.data || []).find((c) =>
        Array.isArray(c.type) ? c.type[0] === "invoice" : c.type === "invoice"
      )?.id || partnerId;

    const dm = await odooFetch("/api/delivery-method", {
      params: { user_id: user.uid },
    });
    const carrierId =
      dm.data?.data?.[0]?.id || dm.data?.data?.[0]?.carrier_id?.[0];

    const upd = await odooFetch(`/api/order/${orderId}/update`, {
      params: {
        origin: "integration-test",
        partner_id: partnerId,
        partner_shipping_id: shipId,
        partner_invoice_id: invId,
        ...(carrierId ? { carrier_id: carrierId } : {}),
      },
    });
    log(
      "GET order update (shipping/invoice/carrier)",
      upd.data?.success == 1,
      `ship=${shipId} inv=${invId} carrier=${carrierId || "n/a"}`
    );

    if (couponList[0]?.id && rewardId) {
      const apply = await odooFetch(`/api/order/${orderId}/apply_loyalty_point`, {
        params: { reward_id: rewardId, cart_id: couponList[0].id },
      });
      log(
        "GET apply_loyalty_point",
        apply.data?.success == 1 || apply.data?.response?.coupon_applied,
        apply.data?.response?.message || apply.data?.message || ""
      );
    }
  }

  // Rider deliveries (public list)
  const riders = await odooFetch("/api/rider-delivery", { params: { limit: 5 } });
  log(
    "GET rider-delivery",
    riders.data?.success == 1,
    `count=${(riders.data?.data || []).length}`
  );

  // Website proxy (if dev server up)
  try {
    const webBase = (process.env.WEBSITE_URL || "http://localhost:3001").replace(
      /\/$/,
      ""
    );
    const proxy = await fetch(
      `${webBase}/api/odoo/api/delivery-method?by_AJR=1&user_id=2`
    );
    const proxyData = await proxy.json();
    log(
      "Website proxy /api/odoo",
      proxy.ok && (proxyData?.success == 1 || Array.isArray(proxyData?.data)),
      `http=${proxy.status}`
    );
  } catch (e) {
    log("Website proxy /api/odoo", false, e.message);
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
