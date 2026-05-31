import { ODOO_BASE_URL } from "./config";
import {
  embeddedRecord,
  imageFromOdooRecord,
  imageUrl,
  m2oId,
  m2oName,
  odooWebImageUrl,
  productTemplateImageUrl,
  odooDataList,
  stripHtml,
  toBase64Json,
} from "./utils";

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Strip SKU/internal reference prefix from product name (e.g. "[SKU123] Product" → "Product"). */
function stripSkuPrefix(name) {
  if (!name) return "";
  return String(name).replace(/^\s*\[[^\]]*\]\s*/, "").trim();
}

/** Resolve stock quantity from Odoo product template. */
function resolveStock(template) {
  const qty = template.qty_available ?? template.virtual_available ?? null;
  if (qty != null && Number.isFinite(Number(qty))) {
    return {
      stock: Math.max(0, Math.floor(Number(qty))),
      is_unlimited_stock: 0,
      total_allowed_quantity: Math.max(0, Math.floor(Number(qty))),
    };
  }
  // Fallback: unlimited stock when API doesn't return qty
  return {
    stock: 999,
    is_unlimited_stock: 1,
    total_allowed_quantity: 999,
  };
}

/** Map Odoo product.template record to eGrocer product card shape. */
export function mapProductTemplate(template) {
  const templateId = template.id;
  const variantTuples =
    template.product_variant_id || template.product_variant_ids || [];
  const variants = [];
  const stockInfo = resolveStock(template);

  if (Array.isArray(variantTuples) && variantTuples.length > 0) {
    for (const vt of variantTuples) {
      const variantId = m2oId(vt) || resolveVariantId(template);
      const price = num(template.list_price);
      variants.push({
        id: variantId,
        product_id: templateId,
        product_variant_id: variantId,
        price,
        discounted_price: price,
        stock: stockInfo.stock,
        is_unlimited_stock: stockInfo.is_unlimited_stock,
        total_allowed_quantity: stockInfo.total_allowed_quantity,
        measurement: 1,
        unit: "PCS",
        status: stockInfo.stock > 0 ? 1 : 0,
      });
    }
  } else {
    const price = num(template.list_price);
    const fallbackVariantId = resolveVariantId(template) || templateId;
    variants.push({
      id: fallbackVariantId,
      product_id: templateId,
      product_variant_id: fallbackVariantId,
      price,
      discounted_price: price,
      stock: stockInfo.stock,
      is_unlimited_stock: stockInfo.is_unlimited_stock,
      total_allowed_quantity: stockInfo.total_allowed_quantity,
      measurement: 1,
      unit: "PCS",
      status: stockInfo.stock > 0 ? 1 : 0,
    });
  }

  const image = productTemplateImageUrl(template);

  const rawName = template.name || template.display_name;
  const cleanName = stripSkuPrefix(rawName);

  return {
    id: templateId,
    slug: String(templateId),
    name: cleanName,
    description: stripHtml(template.description || ""),
    image_url: image,
    images: image ? [image] : [],
    variants,
    is_unlimited_stock: stockInfo.is_unlimited_stock,
    total_allowed_quantity: stockInfo.total_allowed_quantity,
    qty_available: stockInfo.stock,
    seller_id: 0,
    seller_name: "",
    brand_id: 0,
    brand: "",
    category_id: m2oId(template.categ_id) || 0,
    tag_names: "",
    rating: 0,
    rating_count: 0,
    status: stockInfo.stock > 0 ? 1 : 0,
    is_deliverable: 1,
    is_favorite: 0,
    barcode: template.barcode || "",
  };
}

export function mapCategory(cat) {
  const id = cat.id;
  const childIds = cat.child_id || [];
  return {
    id,
    name: cat.name || cat.display_name,
    slug: String(id),
    image_url:
      imageFromOdooRecord(cat, "product.public.category", id) ||
      imageUrl(cat.cover_image),
    parent_id: m2oId(cat.parent_id) || 0,
    has_child: childIds.length > 0,
    child_id: childIds,
    translations: {
      name: cat.name || cat.display_name,
    },
    status: 1,
  };
}

function odooStateToLegacyActiveStatus(odooState) {
  const map = {
    draft: 1,
    sent: 2,
    sale: 3,
    done: 6,
    cancel: 7,
  };
  return map[odooState] ?? 2;
}

/** Legacy UI expects `status` as [[code, timestamp], ...] for OrderStatusStepper. */
export function buildOrderStatusSteps(odooState, dateOrder = "") {
  const timestamp = dateOrder || new Date().toISOString();
  const flows = {
    draft: [1],
    sent: [2],
    sale: [2, 3],
    done: [2, 3, 4, 5, 6],
    cancel: [7],
  };
  const codes = flows[odooState] || [2];
  return codes.map((code) => [code, timestamp]);
}

export function formatPartnerAddress(partner) {
  if (!partner) return "";
  const streetLine = [partner.street, partner.street2].filter(Boolean).join(", ");
  const parts = [
    streetLine,
    partner.city,
    partner.zip,
    m2oName(partner.state_id),
    m2oName(partner.country_id),
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");
  const alt =
    partner.contact_address ||
    partner.formatted_address ||
    partner.full_address ||
    partner.address;
  if (typeof alt === "string" && alt.trim()) return stripHtml(alt);
  if (partner.city || partner.zip) {
    return [partner.city, partner.zip].filter(Boolean).join(", ");
  }
  return "";
}

export function mergeShippingPartner(order, fetched) {
  const nested =
    embeddedRecord(order?.partner_shipping_id) ||
    embeddedRecord(order?.partner_id);
  return { ...(nested || {}), ...(fetched || {}) };
}

function resolveLineProduct(line) {
  const raw = line.product_id;
  if (Array.isArray(raw) && raw[0] && typeof raw[0] === "object" && raw[0].id) {
    return raw[0];
  }
  const variantId = m2oId(raw);
  return {
    id: variantId,
    name: m2oName(raw, line.name),
    image_1024: null,
    image_1920: null,
  };
}

function lineImageUrl(productRef, variantId) {
  const tmplId = m2oId(productRef?.product_tmpl_id);
  const fromRecord = imageFromOdooRecord(
    productRef,
    variantId ? "product.product" : "product.template",
    variantId || tmplId
  );
  if (fromRecord) return fromRecord;
  if (tmplId) return odooWebImageUrl("product.template", tmplId);
  if (variantId) return odooWebImageUrl("product.product", variantId);
  return "";
}

export function mapOrderLine(line, orderActiveStatus = 2) {
  const productRef = resolveLineProduct(line);
  const variantId = productRef?.id;
  const templateId = m2oId(productRef?.product_tmpl_id);
  const productName = stripSkuPrefix(
    stripHtml(productRef?.name || line.name || "")
  );
  const qty = num(line.product_uom_qty, 1);
  const price = num(line.price_unit);
  const subtotalExTax = num(line.price_subtotal);
  const lineTax = num(line.price_tax);
  const lineTotal = num(
    line.price_total,
    subtotalExTax + lineTax || price * qty
  );
  const subtotal =
    subtotalExTax || (lineTotal ? Math.max(0, lineTotal - lineTax) : price * qty);
  const activeStatus = Number(orderActiveStatus) || 2;
  const img = lineImageUrl(productRef, variantId);

  return {
    id: line.id,
    order_line_id: line.id,
    product_id: templateId || variantId,
    product_variant_id: variantId,
    name: productName,
    qty,
    quantity: qty,
    price,
    discounted_price: price,
    sub_total: subtotal,
    sub_total_ex_tax: subtotal,
    tax_amount: lineTax,
    line_total: lineTotal,
    image_url: img,
    variant_name: productName,
    status: 1,
    active_status: activeStatus,
    till_status: 6,
    cancelable_status: activeStatus < 6 ? 1 : 0,
  };
}

export function mapCartFromOrder(order, lines, cartItems = null) {
  const cartItemsResolved =
    cartItems || lines.map((line) => mapOrderLine(line));

  const lineSubtotalExTax = cartItemsResolved.reduce(
    (s, i) => s + num(i.sub_total_ex_tax ?? i.sub_total),
    0
  );
  const lineTaxTotal = cartItemsResolved.reduce(
    (s, i) => s + num(i.tax_amount),
    0
  );
  const lineGrandTotal = cartItemsResolved.reduce(
    (s, i) => s + num(i.line_total ?? i.sub_total),
    0
  );

  const amountUntaxed = num(order?.amount_untaxed, lineSubtotalExTax);
  const taxAmount = num(order?.amount_tax, lineTaxTotal);
  const deliveryCharge = num(order?.delivery_charge || order?.amount_delivery);
  const totalAmount = num(
    order?.amount_total,
    amountUntaxed + taxAmount + deliveryCharge
  );

  return {
    cart: cartItemsResolved,
    sub_total: amountUntaxed,
    amount_untaxed: amountUntaxed,
    items_total: lineGrandTotal,
    delivery_charge: deliveryCharge,
    total_amount: totalAmount,
    total: totalAmount,
    order_id: order?.id,
    self_pickup_mode: 1,
    doorstep_delivery_mode: 1,
    cod_allowed: 1,
    tip_amount: 0,
    tax_amount: taxAmount,
  };
}

export function mapPartnerToUser(partner, auth = {}) {
  return {
    id: partner.id,
    name: partner.name || partner.display_name,
    email: partner.email || auth.username || "",
    mobile: partner.phone || partner.mobile || "",
    profile: imageUrl(partner.image_1024 || partner.image_1920),
    balance: num(partner.wallet_balance),
    status: 1,
    type: "customer",
    country_code: "",
    referral_code: "",
    partner_id: partner.id,
    uid: auth.uid,
  };
}

export function mapPartnerToAddress(partner, index = 0) {
  return {
    id: partner.id,
    name: partner.name || partner.display_name,
    mobile: partner.phone || partner.mobile || "",
    type: "home",
    address: [partner.street, partner.street2].filter(Boolean).join(", "),
    landmark: "",
    area: partner.city || "",
    pincode: partner.zip || "",
    city: partner.city || "",
    state: m2oName(partner.state_id),
    country: m2oName(partner.country_id),
    latitude: partner.partner_latitude || partner.latitude || "",
    longitude: partner.partner_longitude || partner.longitude || "",
    is_default: index === 0 ? 1 : 0,
    alternate_mobile: "",
  };
}

export function mapOrder(order, shippingPartner = null) {
  const odooState = Array.isArray(order.state) ? order.state[0] : order.state;
  const legacyActiveStatus = odooStateToLegacyActiveStatus(odooState);
  const lines = order.order_line || [];
  const items = lines.map((line) => mapOrderLine(line, legacyActiveStatus));
  const shipPartner = shippingPartner || {};
  const userName =
    shipPartner.name ||
    shipPartner.display_name ||
    m2oName(order.partner_shipping_id) ||
    m2oName(order.partner_id);
  const orderAddress = formatPartnerAddress(shipPartner);
  const orderMobile =
    shipPartner.phone || shipPartner.mobile || order.partner_phone || "";

  return {
    id: order.id,
    order_id: order.id,
    orders_id: order.name || order.display_name,
    status: buildOrderStatusSteps(odooState, order.date_order),
    active_status: legacyActiveStatus,
    date: order.date_order,
    total: num(order.amount_total),
    final_total: num(order.amount_total),
    remaining_final: num(order.amount_total),
    remaining_total: num(order.amount_total),
    delivery_charge: num(order.amount_delivery),
    payment_method: order.payment_method || "COD",
    items,
    order_items: items,
    address: orderAddress,
    order_address: orderAddress,
    user_name: userName,
    order_mobile: orderMobile,
    order_note: normalizeOrderNote(order.note),
    partner_shipping_id: m2oId(order.partner_shipping_id),
    order_type: "doorstep",
    otp: order.otp || 0,
    promo_discount: num(order?.amount_discount ?? order?.reward_amount),
    wallet_balance: 0,
    additional_charges: [],
    transaction_id: 0,
  };
}

function normalizeOrderNote(note) {
  const text = stripHtml(note || "");
  if (!text) return "";
  if (/^terms\s*&\s*conditions/i.test(text)) return "";
  return text;
}

function mapOrderState(odooState) {
  const map = {
    draft: "pending",
    sent: "pending",
    sale: "received",
    done: "delivered",
    cancel: "cancelled",
  };
  return map[odooState] || odooState || "pending";
}

export function mapPaymentProviders(providers) {
  const methods = {};
  for (const p of providers) {
    const code = Array.isArray(p.code) ? p.code[0] : p.code;
    if (code === "custom") {
      methods.cod_payment_method = "1";
    }
    if (code === "demo") {
      methods.cod_payment_method = methods.cod_payment_method ?? "1";
    }
  }
  if (!Object.keys(methods).length) {
    methods.cod_payment_method = "1";
  }
  return methods;
}

/** Resolve default product.product id from Odoo template payload. */
export function resolveVariantId(templateOrVariant) {
  const variants =
    templateOrVariant?.product_variant_id ||
    templateOrVariant?.product_variant_ids ||
    [];
  if (Array.isArray(variants) && variants.length > 0) {
    return m2oId(variants[0]) || null;
  }
  return null;
}

/** Build storefront settings blob (base64 in legacy API). */
export async function buildSettingsPayload({ logoUrl, currency = "AED" } = {}) {
  const webName = process.env.NEXT_PUBLIC_WEB_NAME || "Coop Discounts";
  const brandPrimary =
    process.env.NEXT_PUBLIC_BRAND_PRIMARY || "#D61F26";
  const brandLight =
    process.env.NEXT_PUBLIC_BRAND_LIGHT || "#FFE8E9";
  const settings = {
    currency,
    decimal_point: 2,
    max_cart_items_count: 50,
    phone_auth_password: 1,
    phone_login: 1,
    email_login: 1,
    phone_auth_otp: 0,
    custom_sms_gateway_otp_based: 0,
    firebase_authentication: 0,
    guest_cart: 1,
    favorite_product_ids: [],
    favicon: logoUrl || "",
    web_settings: {
      website_mode: 0,
      website_mode_remark: "",
      color: brandPrimary,
      light_color: brandLight,
      web_logo: logoUrl || imageUrl(`/web/image/deal.day.slider/12/banner_image`),
      site_title: webName,
      app_title: webName,
      app_short_description: "",
      copyright_details: `© ${new Date().getFullYear()} ${webName}`,
      is_android_app: "0",
      is_ios_app: "0",
      placeholder_image: logoUrl || "",
    },
    default_city: {
      latitude: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || "25.2048",
      longitude: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || "55.2708",
      name: "Dubai",
    },
  };
  return toBase64Json(settings);
}

export function mapProductsResponse(payload, offset = 0) {
  const list = odooDataList(payload).map(mapProductTemplate);

  let min_price = 0;
  let max_price = 1000;
  
  if (list.length > 0) {
    const prices = list.flatMap(p => p.variants.map(v => v.price));
    if (prices.length > 0) {
      min_price = Math.floor(Math.min(...prices));
      max_price = Math.ceil(Math.max(...prices));
    }
  }

  if (max_price <= min_price) {
    max_price = min_price + 100;
  }

  return {
    status: 1,
    data: list,
    total: list.length + offset + (list.length >= 10 ? 10 : 0),
    total_min_price: payload?.total_min_price || min_price,
    total_max_price: payload?.total_max_price || max_price,
    message: "",
  };
}

export function mapSliders(payload) {
  return odooDataList(payload).map((s) => ({
    id: s.id,
    title: s.name || s.display_name,
    image_url: imageUrl(s.banner_image),
    type: "slider",
    product_ids: s.product_ids || [],
    product_tmpl_ids: s.product_tmpl_ids || [],
  }));
}
