/**
 * Odoo (Coop Discounts) API facade — maps Odoo REST + session auth
 * to the eGrocer website response contract (`status`, `data`, `message`).
 */
export * from "./config";
export * from "./session";
export * as auth from "./services/auth";
export * as products from "./services/products";
export * as cart from "./services/cart";
export * as orders from "./services/orders";
export * as contacts from "./services/contacts";
export * as settings from "./services/settings";
export * as checkout from "./services/checkout";
export * as loyalty from "./services/loyalty";
export * as invoices from "./services/invoices";
export * as delivery from "./services/delivery";
export * as banners from "./services/banners";
export * as geo from "./services/geo";
export * from "./endpoints";
