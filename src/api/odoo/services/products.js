import { odooGet } from "../client";
import { getOdooSession } from "../session";
import { mapCategory, mapProductTemplate, mapProductsResponse } from "../mappers";
import { encodeDomain, fail, imageUrl, isOdooSuccess, odooDataList, ok } from "../utils";

export async function getCategories({ id, slug, limit = 50, offset = 0 } = {}) {
  try {
    if (id || slug) {
      const catId = id || slug;
      const payload = await odooGet(`/api/bcd-website-category/${catId}`);
      const list = odooDataList(payload).map(mapCategory);
      return ok(list);
    }
    const payload = await odooGet("/api/bcd-website-category");
    const list = odooDataList(payload).map(mapCategory).slice(offset, offset + limit);
    return ok(list);
  } catch (e) {
    console.error("[Odoo] getCategories", e);
    return fail(e?.message);
  }
}

export async function getProductByFilter({ filters = {}, slug, tag_names } = {}) {
  try {
    const limit = filters.limit || 12;
    const offset = filters.offset || 0;
    const params = { limit, Offset: offset, user_id: getOdooSession()?.uid || 2 };

    const domainParts = [];
    if (filters.search) {
      domainParts.push(`('name','ilike','${filters.search.replace(/'/g, "")}')`);
    }
    if (slug) {
      domainParts.push(`('id','=',${Number(slug) || slug})`);
    }
    if (tag_names) {
      domainParts.push(`('name','ilike','${tag_names.replace(/'/g, "")}')`);
    }
    if (filters.category_id) {
      domainParts.push(`('categ_id','=',${filters.category_id})`);
    }
    if (filters.barcode) {
      domainParts.push(`('barcode','=','${filters.barcode.replace(/'/g, "")}')`);
    }
    if (domainParts.length) {
      params.domain = `[${domainParts.join(",")}]`;
    }

    const payload = await odooGet("/api/bcp-product-template", params);
    if (!isOdooSuccess(payload)) {
      return fail(payload?.message || "products_fetch_failed");
    }
    const list = odooDataList(payload).map(mapProductTemplate);
    return {
      status: 1,
      data: list,
      total: offset + list.length + (list.length >= limit ? limit : 0),
      message: "",
    };
  } catch (e) {
    console.error("[Odoo] getProductByFilter", e);
    return fail(e?.message);
  }
}

export async function getProductById({ id, slug }) {
  try {
    const productId = id > 0 ? id : slug;
    const payload = await odooGet(`/api/bcp-product-template/${productId}`, { user_id: getOdooSession()?.uid || 2 });
    if (!isOdooSuccess(payload)) {
      return fail(payload?.message || "product_not_found");
    }
    const template = odooDataList(payload)[0];
    if (!template) return fail("product_not_found");
    return ok(mapProductTemplate(template));
  } catch (e) {
    console.error("[Odoo] getProductById", e);
    return fail(e?.message);
  }
}

export async function getBrands() {
  try {
    const payload = await odooGet("/api/product-category");
    const list = odooDataList(payload).map((c) => ({
      id: c.id,
      name: c.name || c.display_name,
      image_url: "",
      status: 1,
    }));
    return ok(list);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getSliders() {
  try {
    const payload = await odooGet("/api/bcd-deal-day-slider/7");
    return ok(
      odooDataList(payload).map((s) => ({
        id: s.id,
        title: s.name,
        image: s.banner_image,
        image_url: imageUrl(
          s.banner_image || `/web/image/deal.day.slider/${s.id}/banner_image`
        ),
      }))
    );
  } catch (e) {
    return fail(e?.message);
  }
}

export async function searchProductsByBarcode(barcode) {
  const payload = await odooGet("/api/bcp-product-template", {
    domain: `[('barcode','=','${barcode}')]`,
    user_id: getOdooSession()?.uid || 2,
  });
  return mapProductsResponse(payload);
}
