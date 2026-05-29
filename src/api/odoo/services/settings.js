import { odooGet } from "../client";
import {
  buildSettingsPayload,
  mapPaymentProviders,
  mapProductTemplate,
} from "../mappers";
import { getAllSliders, getHomepageSections } from "./banners";
import { getCategories } from "./products";
import { fail, isOdooSuccess, odooDataList, ok, toBase64Json } from "../utils";
import { imageUrl } from "../utils";

export async function getSetting() {
  try {
    let logoUrl = "";
    try {
      const banner = await odooGet("/api/bcd-deal-day-slider/12");
      const row = odooDataList(banner)[0];
      logoUrl = imageUrl(row?.banner_image);
    } catch {
      /* optional */
    }
    const encoded = await buildSettingsPayload({ logoUrl, currency: "AED" });
    return ok(encoded);
  } catch (e) {
    console.error("[Odoo] getSetting", e);
    return fail(e?.message);
  }
}

export async function getPaymentSetting() {
  try {
    const payload = await odooGet("/api/payment-provider", {
      domain: "[('state','in',['enabled','test'])]",
    });
    if (!isOdooSuccess(payload)) {
      return {
        status: 1,
        data: toBase64Json(mapPaymentProviders([])),
      };
    }
    const methods = mapPaymentProviders(odooDataList(payload));
    return { status: 1, data: toBase64Json(methods) };
  } catch (e) {
    console.error("[Odoo] getPaymentSetting", e);
    return {
      status: 1,
      data: toBase64Json(mapPaymentProviders([])),
    };
  }
}

export async function getTimeSlots() {
  return ok({
    time_slots_is_enabled: "false",
    delivery_estimate_days: 1,
    time_slots: [],
  });
}

export async function getCity() {
  return ok({
    city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Dubai",
    latitude: process.env.NEXT_PUBLIC_DEFAULT_LATITUDE || "25.2048",
    longitude: process.env.NEXT_PUBLIC_DEFAULT_LONGITUDE || "55.2708",
  });
}

export async function getShop() {
  try {
    const [slidersRes, categoriesRes, productsPayload, homepageSectionsRes] = await Promise.all([
      getAllSliders(),
      getCategories({ limit: 20 }),
      odooGet("/api/bcp-product-template", { limit: 12, Offset: 0 }),
      getHomepageSections(),
    ]);

    const homepageSections = homepageSectionsRes?.status === 1
      ? homepageSectionsRes.data
      : {};

    const allProducts = isOdooSuccess(productsPayload)
      ? odooDataList(productsPayload)
          .map(mapProductTemplate)
          .filter((p) => {
            const name = String(p.name || "").toLowerCase();
            return (
              !name.includes("home delivery") &&
              !name.includes("store pickup") &&
              !name.includes("standard delivery") &&
              Number(p.variants?.[0]?.price || 0) > 0
            );
          })
      : [];

    const heroSliderData = homepageSections.heroSlider && homepageSections.heroSlider.length > 0 
      ? homepageSections.heroSlider[0] 
      : null;
      
    let sliders = [];
    if (heroSliderData && heroSliderData.image_ids && heroSliderData.image_ids.length > 0) {
      sliders = heroSliderData.image_ids.map(img => ({
        id: img.id,
        title: img.name,
        image_url: img.image_url,
        type: "slider_url",
        slider_url: ""
      }));
    } else if (heroSliderData && heroSliderData.banner_image) {
      sliders = [{
        id: heroSliderData.id,
        title: heroSliderData.name,
        image_url: heroSliderData.banner_image,
        type: "slider_url",
        slider_url: ""
      }];
    }

    const categories =
      categoriesRes?.status === 1 ? categoriesRes.data || [] : [];

    const productIds = new Set();
    const sectionKeys = ['dealOfTheDay', 'bestSellers', 'recommendedForYou', 'featuredProducts', 'freshPickToday'];
    
    const extractId = (val) => {
      if (!val) return null;
      if (typeof val === 'object' && !Array.isArray(val)) return Number(val.id);
      if (Array.isArray(val)) return Number(val[0]?.id || val[0]);
      return Number(val);
    };

    for (const key of sectionKeys) {
      const sectionSliders = homepageSections[key] || [];
      for (const slider of sectionSliders) {
        if (slider.image_ids) {
          slider.image_ids.forEach(img => {
            const pid = extractId(img.product_id);
            if (pid) productIds.add(pid);
          });
        }
      }
    }

    let sectionProducts = [];
    if (productIds.size > 0) {
      const validIds = Array.from(productIds).filter(id => id && !isNaN(id));
      if (validIds.length > 0) {
        const domain = `[('id', 'in', [${validIds.join(",")}])]`;
        const secPayload = await odooGet("/api/bcp-product-template", { domain, limit: 1000 });
        if (isOdooSuccess(secPayload)) {
          sectionProducts = odooDataList(secPayload).map(mapProductTemplate);
        }
      }
    }

    const createSection = (slidersList, id, title) => {
      const prods = [];
      slidersList.forEach(slider => {
        const sliderProdIds = new Set();
        if (slider.image_ids) {
          slider.image_ids.forEach(img => {
            const pid = extractId(img.product_id);
            if (pid) sliderProdIds.add(pid);
          });
        }
        
        sectionProducts.forEach(p => {
          if (sliderProdIds.has(Number(p.id))) prods.push(p);
        });
      });
      if (prods.length === 0) return null;
      return {
        id,
        position: "below_slider",
        style_web: "style_1",
        translations: {
          title,
          short_description: "",
        },
        background_color_for_light_theme: "",
        background_color_for_dark_theme: "",
        products: prods,
      };
    };

    const sections = [];
    const pushSection = (slidersList, title) => {
      if (!slidersList || slidersList.length === 0) return;
      const sec = createSection(slidersList, sections.length + 1, title);
      if (sec) sections.push(sec);
    };

    pushSection(homepageSections.dealOfTheDay, "Deal Of The Day");
    pushSection(homepageSections.bestSellers, "Best Sellers");
    pushSection(homepageSections.recommendedForYou, "Recommended For You");
    pushSection(homepageSections.featuredProducts, "Featured Products");
    pushSection(homepageSections.freshPickToday, "Fresh Pick Today");

    // Add Shop By Brand as a special section type to be handled by FeatureSections if needed,
    // but the brand slider is already handled globally in FeatureSections by `shop.brands`.
    let brands = [];
    if (homepageSections.shopByBrand && homepageSections.shopByBrand.length > 0) {
      brands = homepageSections.shopByBrand[0].image_ids.map(img => ({
        id: img.id,
        name: img.name,
        image_url: img.image_url,
        status: 1
      }));
    }

    return ok({
      shop: { id: 1, name: "Coop Discounts", status: 1 },
      sliders,
      categories,
      sections,
      offers: [],
      brands,
      countries: [],
      sellers: [],
      homepageSections,
      allProducts,
    });
  } catch (e) {
    console.error("[Odoo] getShop", e);
    return ok({
      shop: { id: 1, name: "Coop Discounts", status: 1 },
      sliders: [],
      categories: [],
      sections: [],
      offers: [],
      brands: [],
      countries: [],
      sellers: [],
      homepageSections: {},
      allProducts: [],
    });
  }
}

export async function getSystemLanguages() {
  return ok([{ id: 1, name: "English", code: "en", is_default: 1 }]);
}

export async function getPromo({ amount = 0 } = {}) {
  const { getLoyaltyCoupons, getLoyaltyPrograms } = await import("./loyalty");
  const coupons = await getLoyaltyCoupons();
  if (coupons.status === 1 && coupons.data?.length) return coupons;
  const programs = await getLoyaltyPrograms();
  if (programs.status === 1) return programs;
  return ok([]);
}

export async function setPromoCode({ promoCodeName, amount = 0, applyToOrder = true }) {
  const { validateAndApplyPromoCode, validatePromoCode } = await import(
    "./loyalty"
  );
  if (applyToOrder && promoCodeName) {
    return validateAndApplyPromoCode({ promoCodeName, amount });
  }
  return validatePromoCode({ promoCodeName, amount });
}

export async function getFAQs() {
  return ok([]);
}

export async function getNotifications() {
  return ok([]);
}
