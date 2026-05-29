import { odooGet } from "../client";
import { BANNER_SLIDER_IDS, HOMEPAGE_SLIDER_IDS } from "../endpoints";
import { fail, imageUrl, odooDataList, ok } from "../utils";

function mapSlider(slider) {
  return {
    id: slider.id,
    title: slider.name || slider.display_name,
    image_url: imageUrl(slider.banner_image),
    banner_image: imageUrl(slider.banner_image),
    product_ids: slider.product_ids || [],
    product_tmpl_ids: slider.product_tmpl_ids || [],
    image_ids: (slider.image_ids || []).map((img) => ({
      id: img.id,
      name: img.name || img.display_name,
      image_url: imageUrl(img.image_url || img.image || img.banner_image || `/web/image/slider.image/${img.id}/image`),
      product_id: img.product_id || null,
    })),
    type: "slider",
    published: slider.published === "True" || slider.published === true,
  };
}

export async function getSlider(id) {
  try {
    const payload = await odooGet(`/api/bcd-deal-day-slider/${id}`);
    return ok(odooDataList(payload).map(mapSlider));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getAllSliders() {
  try {
    const payload = await odooGet("/api/bcd-deal-day-slider");
    return ok(odooDataList(payload).map(mapSlider));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getHomeBanners() {
  const [logo, exclusive, welcome] = await Promise.all([
    getSlider(BANNER_SLIDER_IDS.companyLogo),
    getSlider(BANNER_SLIDER_IDS.homeExclusive),
    getSlider(BANNER_SLIDER_IDS.welcomeBanners),
  ]);
  return ok({
    logo: logo.data?.[0] || null,
    exclusive: exclusive.data || [],
    welcome: welcome.data || [],
  });
}

/**
 * Fetch all homepage slider sections in parallel.
 * Returns an object keyed by section name with slider data.
 */
export async function getHomepageSections() {
  const ids = HOMEPAGE_SLIDER_IDS;
  const [heroRes, dealRes, bestRes, recRes, featRes, freshRes, brandRes] =
    await Promise.all([
      getSlider(ids.mainHeroSlider),
      getSlider(ids.dealOfTheDay),
      getSlider(ids.bestSellers),
      getSlider(ids.recommendedForYou),
      getSlider(ids.featuredProducts),
      getSlider(ids.freshPickToday),
      getSlider(ids.shopByBrand),
    ]);

  return ok({
    heroSlider: heroRes.data || [],
    dealOfTheDay: dealRes.data || [],
    bestSellers: bestRes.data || [],
    recommendedForYou: recRes.data || [],
    featuredProducts: featRes.data || [],
    freshPickToday: freshRes.data || [],
    shopByBrand: brandRes.data || [],
  });
}

export { BANNER_SLIDER_IDS, HOMEPAGE_SLIDER_IDS };
