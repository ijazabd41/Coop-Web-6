/**
 * Complete Odoo REST endpoint catalog (cooperp.freeddns.org:8076).
 * Updated to match 20260519 V1 Postman collection.
 * All routes require query param `by_AJR=1` unless noted.
 */
export const ODOO_ENDPOINTS = {
  auth: {
    authenticate: "/web/session/authenticate",
  },
  contacts: {
    list: "/api/contacts",
    get: (id) => `/api/contacts/${id}`,
    update: (id) => `/api/contacts/${id}/update`,
    register: "/api/contacts/new_registration",
  },
  user: {
    update: (uid) => `/api/user/${uid}/update`,
  },
  geo: {
    countries: "/api/country",
    states: "/api/country-state",
  },
  catalog: {
    websiteCategories: "/api/bcd-website-category",
    websiteCategory: (id) => `/api/bcd-website-category/${id}`,
    productCategories: "/api/product-category",
    productTemplates: "/api/bcp-product-template",
    productTemplate: (id) => `/api/bcp-product-template/${id}`,
    products: "/api/product",
  },
  banners: {
    sliders: "/api/bcd-deal-day-slider",
    slider: (id) => `/api/bcd-deal-day-slider/${id}`,
  },
  orders: {
    list: "/api/order",
    get: (id) => `/api/order/${id}`,
    create: "/api/order/create_order",
    update: (id) => `/api/order/${id}/update`,
    createInvoice: (id) => `/api/order/${id}/create_invoice`,
    getOrCreateTransaction: (id) => `/api/order/${id}/get_or_create_transaction`,
    markTransactionDone: (id) => `/api/order/${id}/order_transaction_mark_done`,
    removeCardItem: (id) => `/api/order/${id}/remove_card_item`,
    mobileOrder: (id) => `/mobile/my-order/${id}`,
  },
  orderLines: {
    list: "/api/order-line",
    get: (id) => `/api/order-line/${id}`,
    create: "/api/order-line/create",
    update: (id) => `/api/order-line/${id}/update`,
    qty: (id) => `/api/order-line-qty/${id}`,
  },
  delivery: {
    methods: "/api/delivery-method",
    orders: "/api/delivery-order",
    order: (id) => `/api/delivery-order/${id}`,
    orderUpdate: (id) => `/api/delivery-order/${id}/update`,
    rider: "/api/rider-delivery",
    riderUpdate: (id) => `/api/rider-delivery/${id}/update`,
    feedback: "/delivery-feedback",
  },
  payments: {
    providers: "/api/payment-provider",
    provider: (id) => `/api/payment-provider/${id}`,
  },
  invoices: {
    list: "/api/invoice/",
    get: (id) => `/api/invoice/${id}`,
    update: (id) => `/api/invoice/${id}/update`,
    myInvoice: (id) => `/my/invoices/${id}`,
  },
  loyalty: {
    cards: "/api/loyalty-card",
    coupons: "/api/loyalty-coupon",
    programs: "/api/loyalty-program",
    reward: (id) => `/api/loyalty-reward/${id}`,
  },
  config: {
    settings: "/api/config-settings",
    settingsCreate: "/api/config-settings/create",
  },
};

/** Known bcd-deal-day-slider IDs from 20260519 API documentation */
export const BANNER_SLIDER_IDS = {
  companyLogo: 12,
  splashIntro: 13,
  welcomeBanners: 10,
  homeExclusive: 7,
  slider1: 1,
  slider2: 2,
  slider3: 3,
  slider4: 4,
  slider5: 5,
  slider8: 8,
  slider9: 9,
};

/** Homepage section slider IDs — exact order from requirements */
export const HOMEPAGE_SLIDER_IDS = {
  mainHeroSlider: 9,
  dealOfTheDay: 2,
  bestSellers: 1,
  recommendedForYou: 3,
  featuredProducts: 4,
  freshPickToday: 5,
  shopByBrand: 8,
  companyLogo: 12,
};
