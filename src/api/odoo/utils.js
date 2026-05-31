import { ODOO_BASE_URL } from "./config";

/** Parse Odoo many2one / one2many tuple: `[id, name]` or plain id. */
export function m2oId(value) {
  if (value == null || value === "" || value === false) return null;
  if (Array.isArray(value)) {
    const first = value[0];
    if (first != null && typeof first === "object") {
      return first.id ?? null;
    }
    return first ?? null;
  }
  if (typeof value === "object" && value.id != null) return value.id;
  return Number(value) || null;
}

/** Strip Odoo HTML fields (e.g. order note) for plain-text UI. */
export function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function m2oName(value, fallback = "") {
  if (Array.isArray(value)) return value[1] ?? fallback;
  if (typeof value === "object" && value.name) return value.name;
  return fallback;
}

/** Expanded Odoo record embedded in a many2one array, e.g. `partner_id: [{ id, name, street }]`. */
export function embeddedRecord(value) {
  if (Array.isArray(value) && value[0] && typeof value[0] === "object" && value[0].id) {
    return value[0];
  }
  if (value && typeof value === "object" && value.id != null) return value;
  return null;
}

/** Public Odoo origin — used for `/web/image/...` (works without Next.js API proxy). */
export function odooPublicBase() {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    ODOO_BASE_URL ||
    "http://cooperp.freeddns.org:8076"
  ).replace(/\/$/, "");
}

/** Extract `/web/image/...` from Odoo API paths that embed it. */
export function normalizeOdooImagePath(path) {
  if (path == null || path === false) return "";
  let raw = String(path).trim();
  if (!raw) return "";

  if (raw.startsWith("data:")) return raw;

  // Fix duplicated proxy prefix from legacy/double-mapped URLs
  raw = raw.replace(/\/api\/odoo\/api\/odoo\//g, "/api/odoo/");

  const webIdx = raw.search(/\/web\/image\//);
  if (webIdx >= 0) {
    let imgPath = raw.slice(webIdx).split("?")[0];
    imgPath = imgPath.replace(/^\/+/, "/");
    return imgPath;
  }

  if (!raw.startsWith("http") && !raw.startsWith("/") && raw.length > 80) {
    return raw;
  }

  return raw;
}

/**
 * Build a browser-loadable URL for an Odoo image.
 * Product/media URLs use the public Odoo host (`NEXT_PUBLIC_API_URL`) so they work
 * with static export (`NEXT_PUBLIC_SEO=false`) where `/api/odoo` routes are absent.
 */
export function imageUrl(path) {
  const normalized = normalizeOdooImagePath(path);
  if (!normalized) return "";

  if (normalized.startsWith("data:")) return normalized;

  if (!normalized.startsWith("http") && !normalized.startsWith("/") && normalized.length > 80) {
    const b64 = normalized.replace(/\s/g, "");
    return `data:image/png;base64,${b64}`;
  }

  const base = odooPublicBase();

  if (normalized.startsWith("http")) {
    try {
      const u = new URL(normalized);
      const odooHost = new URL(`${base}/`).hostname;
      if (u.hostname === odooHost) {
        const rel = u.pathname + u.search;
        if (rel.startsWith("/web/image/")) {
          return `${base}${rel}`;
        }
        if (rel.startsWith("/api/odoo/web/image/")) {
          return `${base}${rel.replace(/^\/api\/odoo/, "")}`;
        }
      }
      return normalized;
    } catch {
      return normalized;
    }
  }

  let relative = normalized.startsWith("/") ? normalized : `/${normalized}`;

  if (relative.startsWith("/api/odoo/web/image/")) {
    relative = relative.replace(/^\/api\/odoo/, "");
  }

  if (relative.startsWith("/web/image/")) {
    return `${base}${relative}`;
  }

  if (relative.startsWith("/api/odoo/")) {
    return relative;
  }

  if (typeof window !== "undefined") {
    return `/api/odoo${relative}`;
  }

  return `${base}${relative}`;
}

/**
 * Standard Odoo image URL for a model record.
 * Maps to the exact paths used in the reference implementation.
 */
export function odooWebImageUrl(model, recordId, field = "image_1024") {
  if (!model || !recordId) return "";
  
  // Exact mappings from reference api.js
  if (model === "product.template") return imageUrl(`/web/image/product.template/${recordId}/image_1024`);
  if (model === "product.public.category") return imageUrl(`/web/image/product.public.category/${recordId}/image_1024`);
  if (model === "slider.image") return imageUrl(`/web/image/slider.image/${recordId}/image`);
  if (model === "deal.day.slider") return imageUrl(`/web/image/deal.day.slider/${recordId}/banner_image`);
  if (model === "res.partner") return imageUrl(`/web/image/res.partner/${recordId}/image_1920`);

  return imageUrl(`/web/image/${model}/${recordId}/${field}`);
}

/**
 * Product image URL per `bcp-product-template` API (Postman CD.COM docs).
 */
export function productTemplateImageUrl(template) {
  if (!template?.id) return "";
  return imageUrl(`/web/image/product.template/${template.id}/image_1024`);
}

/** Pick best image from an Odoo record. */
export function imageFromOdooRecord(record, model, recordId) {
  const id = recordId || record?.id;

  if (model && id) {
    return odooWebImageUrl(model, id);
  }

  const fields = [
    record?.image_1024,
    record?.image_1920,
    record?.image_512,
    record?.image_128,
    record?.image,
    record?.cover_image,
    record?.banner_image,
  ];
  for (const field of fields) {
    const url = imageUrl(field);
    if (url) return url;
  }
  return "";
}

export function encodeDomain(domain) {
  return encodeURIComponent(
    typeof domain === "string" ? domain : JSON.stringify(domain)
  );
}

/** Normalize Odoo API JSON (`success` / `data` / `response`). */
export function unwrapOdooPayload(raw) {
  if (raw == null) return { success: 0, data: [], message: "Empty response" };
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return { success: 0, data: [], message: raw };
    }
  }
  return raw;
}

export function isOdooSuccess(payload) {
  return payload?.success === 1 || payload?.success === "1";
}

export function odooDataList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.response)) return payload.response;
  if (payload.response?.data) return payload.response.data;
  if (payload.response && typeof payload.response === "object") {
    return [payload.response];
  }
  return [];
}

/** eGrocer-style API envelope used across the existing UI. */
export function ok(data, extra = {}) {
  return { status: 1, message: "", data, ...extra };
}

export function fail(message = "request_failed", extra = {}) {
  return { status: 0, message, data: null, ...extra };
}

export function isOdooAccessError(message) {
  const raw = String(message || "");
  return raw.includes("not allowed to access") || raw.includes("AccessError");
}

export function toBase64Json(obj) {
  if (typeof window === "undefined") {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
  }
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
}
