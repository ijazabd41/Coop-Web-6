"use client";

/**
 * Storefront API — Odoo (Coop Discounts) backend integration.
 * @see src/api/odoo/
 */
import * as odooAuth from "./odoo/services/auth";
import * as odooProducts from "./odoo/services/products";
import * as odooCart from "./odoo/services/cart";
import * as odooOrders from "./odoo/services/orders";
import * as odooContacts from "./odoo/services/contacts";
import * as odooSettings from "./odoo/services/settings";
import * as odooCheckout from "./odoo/services/checkout";
import * as odooLoyalty from "./odoo/services/loyalty";
import * as odooInvoices from "./odoo/services/invoices";
import * as odooDelivery from "./odoo/services/delivery";
import * as odooBanners from "./odoo/services/banners";
import * as odooGeo from "./odoo/services/geo";
import { fail, ok } from "./odoo/utils";

function flattenCartResponse(result) {
  if (!result || result.status !== 1) return result;
  const data = result.data || result;
  return { status: 1, message: result.message || "", data, ...data };
}

export function cartProductsFromResponse(res) {
  const cart = res?.data?.cart || res?.cart || [];
  if (!Array.isArray(cart)) return [];
  return cart.map((product) => ({
    product_id: product?.product_id,
    product_variant_id: product?.product_variant_id,
    qty: product?.qty ?? product?.quantity ?? 1,
  }));
}

/** Normalized cart blob for Redux `setCart`. */
export function cartDataFromResponse(res) {
  if (!res || res.status !== 1) return null;
  if (res.data?.cart) return res.data;
  if (res.cart) {
    return {
      cart: res.cart,
      sub_total: res.sub_total,
      amount_untaxed: res.amount_untaxed,
      total_amount: res.total_amount,
      delivery_charge: res.delivery_charge,
      tax_amount: res.tax_amount,
      self_pickup_mode: res.self_pickup_mode,
      doorstep_delivery_mode: res.doorstep_delivery_mode,
      order_id: res.order_id,
    };
  }
  return null;
}

// Authentication
export const registerUser = (p) => odooAuth.register(p);
export const login = (p) => odooAuth.login(p);
export const sendSms = (p) => odooAuth.sendSms(p);
export const verifyOTP = (p) => odooAuth.verifyOTP(p);
export const verifyEmail = (p) => odooAuth.verifyEmail(p);
export const forgotPasswordOtp = (p) => odooAuth.forgotPasswordOTP(p);
export const forgotPassword = (p) => odooAuth.forgotPassword(p);
export const resetPassword = (p) => odooAuth.resetPassword(p);
export const updateUserPassword = (p) => odooAuth.updateUserPassword(p);
export const updateProfile = (p) => odooAuth.updateProfile(p);
export const getUser = () => odooAuth.getUser();
export const logout = () => odooAuth.logout();
export const deleteAccount = (p) => odooAuth.deleteAccount(p);
export const verifyUserByPhoneNum = (p) => odooAuth.verifyUserByPhoneNum(p);

// Location stubs (Google Places — configure separately)
export const getPlaces = async () => ok({ predictions: [] });
export const getPlacesDetails = async () => ok({});

// Catalog
export const getCity = (p) => odooSettings.getCity(p);
export const getShop = (p) => odooSettings.getShop(p);
export const getCategories = (p) => odooProducts.getCategories(p);
export const getProductByFilter = (p) => odooProducts.getProductByFilter(p);
export const getBrands = (p) => odooProducts.getBrands(p);
export const getSetting = () => odooSettings.getSetting();
export const getProductById = (p) => odooProducts.getProductById(p);
export const getProductRatings = async () => ok([]);
export const getProductImages = async () => ok([]);
export const getPaymentSetting = () => odooSettings.getPaymentSetting();
export const getSystemLanguages = (p) => odooSettings.getSystemLanguages(p);
export const updateFcmToken = async () => ok(null);
export const getSlider = async () => odooBanners.getSlider(9);
export const getOffer = async () => odooBanners.getAllSliders();
export const getSection = async () => odooBanners.getHomeBanners();

// Cart
const CART_ERROR_MESSAGES = {
  cart_unavailable:
    "Could not open your cart. Please sign in again and try once more.",
  not_authenticated: "Please sign in to add items to your cart.",
  create_order_failed:
    "Could not create a cart on the store. Please try again.",
  add_to_cart_failed: "Could not add this item to your cart.",
  invalid_variant: "This product variant is not available.",
};

function humanizeCartMessage(message) {
  if (!message) return "";
  const key = String(message).trim();
  return CART_ERROR_MESSAGES[key] || key.replace(/_/g, " ");
}

function normalizeCartApiResult(result) {
  const flat = flattenCartResponse(result);
  if (flat?.status !== 1 && flat?.message) {
    flat.message = humanizeCartMessage(flat.message);
  }
  const data = cartDataFromResponse(flat);
  if (!data) return flat;
  return { status: 1, message: flat.message || "", data, ...data };
}

export const getCart = async () => normalizeCartApiResult(await odooCart.getCart());
export const addToBulkCart = async (p) =>
  normalizeCartApiResult(await odooCart.bulkAddToCart(p));
export const addToCart = async (p) =>
  normalizeCartApiResult(
    await odooCart.addToCart({
      product_variant_id: p.product_variant_id,
      product_id: p.product_id,
      qty: p.qty,
    })
  );
export const removeFromCart = async (p) =>
  normalizeCartApiResult(
    await odooCart.removeFromCart({
      product_variant_id: p.product_variant_id,
      product_id: p.product_id,
      isRemoveAll: p.isRemoveAll,
    })
  );
export const deleteCart = async () =>
  normalizeCartApiResult(await odooCart.removeFromCart({ isRemoveAll: 1 }));
export const getGuestCart = async (p) =>
  normalizeCartApiResult(await odooCart.getGuestCart(p));

// Address & geo
export const getAddress = () => odooContacts.getAddress();
export const addAddress = (p) => odooContacts.addAddress(p);
export const updateAddress = (p) => odooContacts.updateAddress(p);
export const deleteAddress = (p) => odooContacts.deleteAddress(p);
export const getCountries = (p) => odooGeo.getCountries(p);

// Wishlist — no Odoo endpoint; client-side only
export const getFavorite = async () => ok([]);
export const addToFavorite = async () => fail("favorites_not_in_odoo_api");
export const removeFromFavorite = async () => fail("favorites_not_in_odoo_api");

// Promo / loyalty
export const getPromo = (p) => odooSettings.getPromo(p);
export const setPromoCode = (p) => odooSettings.setPromoCode(p);
export const applyLoyaltyPoint = (p) => odooLoyalty.applyLoyaltyPoint(p);
export const getLoyaltyPrograms = () => odooLoyalty.getLoyaltyPrograms();
export const getLoyaltyCoupons = (p) => odooLoyalty.getLoyaltyCoupons(p);
export const getLoyaltyCards = () => odooLoyalty.getLoyaltyCards();
export const getLoyaltyReward = (rewardId) => odooLoyalty.getLoyaltyReward(rewardId);
export const getLoyaltyCouponByCode = (code) =>
  odooLoyalty.getLoyaltyCouponByCode(code);
export const validateAndApplyPromoCode = (p) =>
  odooLoyalty.validateAndApplyPromoCode(p);
export const updateOrderDelivery = (p) => odooOrders.updateOrderDelivery(p);
export const listContacts = (p) => odooContacts.listContacts(p);
export const getContactById = (id) => odooContacts.getContactById(id);
export const listRiderDeliveries = (p) => odooDelivery.listRiderDeliveries(p);
export const listRiderOwnDeliveries = (p) =>
  odooDelivery.listRiderOwnDeliveries(p);
export const acceptRiderDelivery = (p) => odooDelivery.acceptRiderDelivery(p);
export const markRiderDeliveryDone = (p) =>
  odooDelivery.markRiderDeliveryDone(p);

// Checkout & orders
export const getTimeSlots = () => odooSettings.getTimeSlots();
export const placeOrder = (p) => odooOrders.placeOrder(p);
export const initiateTrasaction = (p) =>
  odooCheckout.initiateTransaction({
    orderId: p.orderId,
    paymentMethod: p.paymentMethod,
  });
export const addTransaction = (p) =>
  odooCheckout.addTransaction({
    orderId: p.orderId,
    transactionId: p.transaction_id,
    paymentMethod: p.paymentMethod,
  });
export const initiateTestTransaction = (p) => odooCheckout.initiateTestTransaction(p);
export const markTestTransactionDone = (p) => odooCheckout.markTestTransactionDone(p);
export const deleteOrder = (p) => odooOrders.deleteOrder(p);
export const createTelrSession = async (orderId, amount, currency, description) => {
  // Replace with actual Telr endpoint or backend proxy
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/telr/create_session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, amount, currency, description })
  });
  return await response.json();
};
export const verifyTelrPayment = async (telrRef) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/telr/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telrRef })
  });
  return await response.json();
};
export const isOrderConfirmed = async (orderId) => {
  return false; // stub
};
export const confirmOrderPayment = async (orderId, gatewayId) => {
  return true; // stub
};
export const markDone = async (orderId, txId, gatewayId) => {
  return odooCheckout.addTransaction({
    orderId,
    transactionId: txId,
    paymentMethod: 'telr'
  });
};
export const getNotifications = (p) => odooSettings.getNotifications(p);
export const getFAQs = (p) => odooSettings.getFAQs(p);
export const getOrders = (p) => odooOrders.getOrders(p);
export const changeOrderStatus = (p) => odooOrders.changeOrderStatus(p);
export const reviewProduct = (p) =>
  odooDelivery.submitDeliveryFeedback({
    userId: p?.user_id,
    pickingId: p?.order_id,
    feedback: p?.review,
    rating: p?.rate,
  });
export const getProductRating = async () => ok([]);
export const updateReviewProduct = async () => fail("not_supported");
export const downloadInvoice = (p) => odooInvoices.downloadInvoice(p);
export const getUserTransactions = async () => ok([]);
export const liveOrderTracking = (p) =>
  odooDelivery.liveOrderTracking({ orderId: p.order_id });
export const getSellers = async () => ok([]);
export const getOrderStatusPhonepe = async () => fail("not_supported");

// Blogs / subscriptions — not in Odoo customer API
export const getBlogsCategories = async () => ok([]);
export const getBlogs = async () => ok([]);
export const setBlogCount = async () => ok(null);
export const getMostViewedBlogs = async () => ok([]);
export const setProductRequest = async () => fail("not_supported");
export const getRequestedProducts = async () => ok([]);
export const getTags = async () => ok([]);
export const addRecentlyViewedProduct = async () => ok(null);
export const getRecentlyViewedProducts = async () => ok([]);
export const getSubscriptionPlans = async () => ok([]);
export const getUserActivePlan = async () => ok(null);
export const getSubscriptionFaqs = async () => ok([]);
export const getMailSettings = async () => ok([]);
export const updateMailSettings = async () => fail("not_supported");

// Homepage sections (new API)
export const getHomepageSections = () => odooBanners.getHomepageSections();
