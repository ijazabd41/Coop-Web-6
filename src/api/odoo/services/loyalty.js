import { odooGet } from "../client";
import { getOdooSession } from "../session";
import { fail, isOdooSuccess, m2oId, odooDataList, ok } from "../utils";
import { getOrCreateDraftOrder } from "./cart";

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function firstRewardId(coupon) {
  const program = Array.isArray(coupon?.program_id)
    ? coupon.program_id[0]
    : coupon?.program_id;
  const rewards = program?.reward_ids || [];
  const first = rewards[0];
  return first?.id ?? m2oId(first);
}

function mapLoyaltyCouponRow(c) {
  const code =
    c.code ||
    (String(c.display_name || "").includes(":")
      ? String(c.display_name).split(":").pop()?.trim()
      : c.display_name);
  return {
    id: c.id,
    promo_code: code,
    promo_code_id: c.id,
    cart_id: c.id,
    reward_id: firstRewardId(c),
    points: num(c.points ?? c.balance ?? c.point_balance),
    discount: num(c.discount),
    message: c.display_name || "",
    status: 1,
    program_id: m2oId(
      Array.isArray(c.program_id) ? c.program_id[0] : c.program_id
    ),
  };
}

async function resolveRewardDiscount(rewardId, orderAmount = 0, availablePoints = 0) {
  if (!rewardId) return 0;
  try {
    const payload = await odooGet(`/api/loyalty-reward/${rewardId}`, {
      user_id: getOdooSession()?.uid || 2,
    });
    if (!isOdooSuccess(payload)) return 0;
    const reward = odooDataList(payload)[0] || payload.data;
    if (!reward) return 0;
    const rewardType = Array.isArray(reward.reward_type)
      ? reward.reward_type[0]
      : reward.reward_type;
    if (rewardType === "discount") {
      const mode = Array.isArray(reward.discount_mode)
        ? reward.discount_mode[0]
        : reward.discount_mode;
      const value = num(reward.discount ?? reward.discount_max_amount);
      if (mode === "percent") {
        return (orderAmount * value) / 100;
      }
      if (mode === "per_point") {
        return value * availablePoints;
      }
      return value;
    }
    return num(reward.discount_max_amount ?? reward.points);
  } catch {
    return 0;
  }
}

export async function getLoyaltyCouponByCode(code) {
  if (!code) return fail("invalid_promo_code");
  try {
    const safe = String(code).replace(/'/g, "\\'");
    const payload = await odooGet("/api/loyalty-coupon", {
      domain: `[('code','=','${safe}')]`,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    const row = odooDataList(payload)[0];
    if (!row) return fail("invalid_promo_code");
    return ok(mapLoyaltyCouponRow(row));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getLoyaltyCoupons({ partnerId } = {}) {
  const session = getOdooSession();
  const pid = partnerId || session?.partnerId;
  if (!pid) return fail("not_authenticated");
  try {
    const payload = await odooGet("/api/loyalty-coupon", {
      domain: `[('partner_id','=',${pid})]`,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    const rows = await Promise.all(
      odooDataList(payload).map(async (c) => {
        const mapped = mapLoyaltyCouponRow(c);
        if (!mapped.discount && mapped.reward_id) {
          mapped.discount = await resolveRewardDiscount(mapped.reward_id, 0, mapped.points);
        }
        return mapped;
      })
    );
    return ok(rows);
  } catch (e) {
    return fail(e?.message);
  }
}

/** @deprecated Use getLoyaltyCoupons — Odoo uses loyalty-coupon, not loyalty-card */
export async function getLoyaltyCards() {
  return getLoyaltyCoupons();
}

export async function getLoyaltyPrograms() {
  try {
    const payload = await odooGet("/api/loyalty-program", {
      user_id: getOdooSession()?.uid || 2,
    });
    return ok(odooDataList(payload));
  } catch (e) {
    return fail(e?.message);
  }
}

export async function getLoyaltyReward(rewardId) {
  try {
    const payload = await odooGet(`/api/loyalty-reward/${rewardId}`, {
      user_id: getOdooSession()?.uid || 2,
    });
    if (!isOdooSuccess(payload)) return fail(payload?.message);
    return ok(odooDataList(payload)[0] || payload.data);
  } catch (e) {
    return fail(e?.message);
  }
}

export async function applyLoyaltyPoint({ orderId, rewardId, cartId }) {
  try {
    const oid = orderId || (await getOrCreateDraftOrder())?.id;
    if (!oid) return fail("no_cart");
    if (!rewardId || !cartId) return fail("missing_loyalty_params");

    const payload = await odooGet(`/api/order/${oid}/apply_loyalty_point`, {
      reward_id: rewardId,
      cart_id: cartId,
    });
    if (!isOdooSuccess(payload)) {
      return fail(
        payload?.message ||
          payload?.response?.message ||
          "failed_to_apply_loyalty"
      );
    }
    return ok(payload.data || payload.response || payload);
  } catch (e) {
    return fail(e?.message);
  }
}

/**
 * Validate coupon code, resolve discount from loyalty-reward, apply to draft order.
 */
export async function validateAndApplyPromoCode({
  promoCodeName,
  amount = 0,
  orderId,
} = {}) {
  const lookup = await getLoyaltyCouponByCode(promoCodeName);
  if (lookup.status !== 1) return lookup;

  const card = lookup.data;
  if (!card.reward_id) return fail("invalid_promo_code");

  const discount =
    card.discount || (await resolveRewardDiscount(card.reward_id, amount, card.points));

  const applied = await applyLoyaltyPoint({
    orderId,
    rewardId: card.reward_id,
    cartId: card.cart_id,
  });
  if (applied.status !== 1) return applied;

  return ok({
    promo_code: card.promo_code,
    promo_code_id: card.promo_code_id,
    reward_id: card.reward_id,
    cart_id: card.cart_id,
    points: card.points,
    discount,
    total: Math.max(0, num(amount) - discount),
    message: applied.data?.message || card.message,
  });
}

export async function validatePromoCode({ promoCodeName, amount = 0 }) {
  if (!promoCodeName) return fail("invalid_promo_code");

  const byCode = await getLoyaltyCouponByCode(promoCodeName);
  if (byCode.status === 1) {
    const card = byCode.data;
    const discount =
      card.discount ||
      (await resolveRewardDiscount(card.reward_id, amount, card.points));
    return ok({
      ...card,
      discount,
      total: Math.max(0, num(amount) - discount),
    });
  }

  const coupons = await getLoyaltyCoupons();
  if (coupons.status !== 1) return coupons;
  const match = coupons.data.find(
    (c) =>
      String(c.promo_code).toLowerCase() ===
      String(promoCodeName).toLowerCase()
  );
  if (!match) return fail("invalid_promo_code");
  const discount =
    match.discount || (await resolveRewardDiscount(match.reward_id, amount, match.points));
  return ok({
    ...match,
    discount,
    total: Math.max(0, num(amount) - discount),
  });
}
