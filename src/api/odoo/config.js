/** Odoo / Coop Discounts API configuration (from Postman + PDF docs). */
export const ODOO_BASE_URL =
  process.env.ODOO_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://cooperp.freeddns.org:8076";

/** Browser uses same-origin proxy (see src/pages/api/odoo/[...path].js). */
export const ODOO_CLIENT_BASE_URL =
  typeof window !== "undefined" ? "/api/odoo" : ODOO_BASE_URL.replace(/\/$/, "");

export const ODOO_DB = process.env.NEXT_PUBLIC_ODOO_DB || "staging-apr17";

/** Required on all `/api/*` routes per documentation (`by_AJR=1`). */
export const ODOO_API_FLAG = process.env.NEXT_PUBLIC_ODOO_API_FLAG || "1";

export const ODOO_AUTH_PATH = "/web/session/authenticate";

export const STORAGE_KEYS = {
  sessionId: "odoo_session_id",
  partnerId: "odoo_partner_id",
  uid: "odoo_uid",
  draftOrderId: "odoo_draft_order_id",
  db: "odoo_db",
};
