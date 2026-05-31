/** Match a Redux cart line to a catalog product + selected variant. */
export function cartLineMatches(line, product, variantId) {
  if (!line) return false;
  const vId = Number(variantId);
  const templateId = Number(product?.id);
  const lineVariant = Number(line?.product_variant_id);
  const lineProduct = Number(line?.product_id);

  if (!vId && !templateId) return false;

  return (
    (vId && (lineVariant === vId || lineProduct === vId)) ||
    (templateId && (lineVariant === templateId || lineProduct === templateId))
  );
}

export function findCartLine(cartProducts, product, variantId) {
  if (!Array.isArray(cartProducts)) return null;
  return cartProducts.find((line) => cartLineMatches(line, product, variantId)) || null;
}

export function getCartLineQty(cartProducts, product, variantId) {
  return Number(findCartLine(cartProducts, product, variantId)?.qty ?? 0);
}
