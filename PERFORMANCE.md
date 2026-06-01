# Performance optimizations (Coop Web / Odoo storefront)

This document summarizes client and API-layer optimizations. Business logic and API contracts are unchanged.

## API layer (`src/api/odoo/`)

| Change | Impact |
|--------|--------|
| **`requestCache.js`** — TTL cache + in-flight deduplication for `odooGet` | Fewer duplicate calls when multiple components load settings, categories, or products. |
| **Path-based TTL** — e.g. payment providers (5m), sliders (10m), product templates (2m) | Safe caching for mostly-static catalog data. |
| **No cache** — orders, cart lines, contacts, loyalty, mutations | Correct cart/checkout/loyalty behavior preserved. |
| **`invalidateCache('/api/order')`** after cart/loyalty/order updates | Stale cart data not served from cache after writes. |
| **Axios timeout** 60s → 30s | Faster failure on hung upstream requests. |

Re-run integration checks: `node scripts/test-odoo-integration.mjs`

## React Query (`src/lib/queryClient.js`)

- Default `staleTime`: 60s  
- `refetchOnWindowFocus`: false  
- `gcTime`: 10 minutes  

Reduces refetch churn on tab focus and repeated mounts.

## Redux persist (`src/redux/store.js`)

- **Whitelist** only durable slices (User, Cart, Setting, etc.).  
- **Checkout** and **ProductFilter** are not persisted (avoids stale checkout step/filters on reload).  

Cart and user session behavior unchanged for normal shoppers.

## Bundle / code splitting

- **CartDrawer** — dynamic import in `Header.jsx` (not loaded until cart UI needed).  
- **Product modals** — `VariantsModal` / `ProductDetailModal` dynamic on product cards.  
- **PushNotification** — dynamic in `Layout.jsx`.  
- **Nunito font** — weights reduced to 400, 600, 700 (smaller font download).

## Images (`ImageWithPlaceholder.jsx`)

- Remote product URLs use `next/image` with `loading="lazy"` and responsive `sizes`.  
- Respects `NEXT_PUBLIC_SEO=false` → `unoptimized` when static export requires it.

## Rendering

- **`React.memo`** on product cards and `ImageWithPlaceholder`.  
- **`ProductDetail`** uses app-wide `useQueryClient()` instead of a new client per page (fixes broken shop cache updates).  
- **Layout** — settings, payment, and language fetches run in parallel via `Promise.all`.

## What to verify manually

1. Login / logout and session restore  
2. Home shop sections and product grids  
3. Add/update/remove cart  
4. Checkout: address, coupon/loyalty, place order  
5. Order history and product detail  
6. Language and theme toggles  

## Not changed (intentionally)

- Odoo `getShop()` section product `limit: 1000` query (business logic; shrinking IDs could hide products).  
- Admin panel / Flutter apps (separate codebases).  
- CDN — configure at deploy time (Vercel/hosting) for static assets.
