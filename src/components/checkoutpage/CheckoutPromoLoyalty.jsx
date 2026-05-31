import React, { useState, useEffect } from "react";
import { t } from "@/utils/translation";
import * as api from "@/api/apiRoutes";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCartPromo, clearCartPromo } from "@/redux/slices/cartSlice";
import { cartDataFromResponse } from "@/api/apiRoutes";
import { setCart } from "@/redux/slices/cartSlice";

const CheckoutPromoLoyalty = ({ orderId, onApplied }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting?.setting);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (cart?.promo_code?.promo_code && !cart.promo_code.is_loyalty_point) {
      setCodeInput(cart.promo_code.promo_code);
      setPreview({
        points: cart.promo_code.points,
        discount: cart.promo_code.discount,
        promo_code: cart.promo_code.promo_code,
      });
    } else if (!cart?.promo_code) {
      setCodeInput("");
      setPreview(null);
    }
  }, [cart?.promo_code]);

  const fetchCards = async () => {
    try {
      const res = await api.getLoyaltyCoupons();
      if (res?.status === 1) setCards(res.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const refreshCart = async () => {
    const cartRes = await api.getCart();
    const data = cartDataFromResponse(cartRes);
    if (data) dispatch(setCart({ data }));
    if (onApplied) onApplied();
  };

  const handleLookupCode = async () => {
    const code = codeInput.trim();
    if (!code) return toast.error(t("invalid_promo_code"));
    setLookupLoading(true);
    try {
      const res = await api.getLoyaltyCouponByCode(code);
      if (res?.status === 1) {
        setPreview({
          promo_code: res.data.promo_code,
          points: res.data.points,
          discount: res.data.discount,
          reward_id: res.data.reward_id,
          cart_id: res.data.cart_id,
        });
      } else {
        setPreview(null);
        toast.error(res?.message || t("invalid_promo_code"));
      }
    } catch {
      toast.error(t("error_occurred"));
    }
    setLookupLoading(false);
  };

  const handleApplyCode = async () => {
    const code = codeInput.trim();
    if (!code) return toast.error(t("invalid_promo_code"));
    setLoading(true);
    try {
      const res = await api.validateAndApplyPromoCode({
        promoCodeName: code,
        amount: cart?.cartSubTotal,
        orderId,
      });
      if (res?.status === 1) {
        dispatch(setCartPromo({ data: { ...res.data, is_loyalty_point: false } }));
        setPreview({
          points: res.data.points,
          discount: res.data.discount,
          promo_code: res.data.promo_code,
        });
        toast.success(res.data?.message || t("promoCodeSuccess"));
        await refreshCart();
      } else {
        toast.error(res?.message || t("invalid_promo_code"));
      }
    } catch {
      toast.error(t("error_occurred"));
    }
    setLoading(false);
  };

  const handleApplyCard = async (overrideCardId) => {
    const targetId = overrideCardId || selectedCardId;
    if (!targetId) return toast.error(t("please_select_reward"));
    const card = cards.find((c) => String(c.id) === String(targetId));
    if (!card) return;
    setLoading(true);
    try {
      const res = await api.applyLoyaltyPoint({
        orderId,
        rewardId: card.reward_id,
        cartId: card.cart_id || card.id,
      });
      if (res?.status === 1) {
        dispatch(
          setCartPromo({
            data: {
              promo_code: card.promo_code,
              promo_code_id: card.id,
              discount: card.discount,
              points: card.points,
              reward_id: card.reward_id,
              cart_id: card.cart_id,
              is_loyalty_point: true,
            },
          })
        );
        toast.success(t("loyalty_point_applied"));
        await refreshCart();
      } else {
        toast.error(res?.message || t("failed_to_apply_loyalty"));
      }
    } catch {
      toast.error(t("error_occurred"));
    }
    setLoading(false);
  };

  const handleClear = () => {
    dispatch(clearCartPromo());
    setPreview(null);
    setCodeInput("");
    setSelectedCardId("");
  };

  const isLoyaltyApplied = cart?.promo_code?.is_loyalty_point;
  const isCouponApplied = cart?.promo_code && !cart?.promo_code?.is_loyalty_point;

  return (
    <div className="my-4">
      <div className="flex w-full mb-6 border border-gray-300 rounded-md overflow-hidden shadow-sm bg-white">
        <input
          type="text"
          className="p-3 outline-none flex-1 min-w-0"
          placeholder={t("gift_card_or_discount_code") || "Gift card or discount code..."}
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          disabled={!!isCouponApplied}
        />
        {isCouponApplied ? (
           <button
             type="button"
             onClick={handleClear}
             className="px-6 py-3 bg-gray-100 text-gray-800 text-base font-medium border-l border-gray-300 hover:bg-gray-200 transition-colors"
           >
             {t("delete") || "Remove"}
           </button>
        ) : (
           <button
             type="button"
             onClick={handleApplyCode}
             disabled={loading || !codeInput.trim()}
             className="px-6 py-3 bg-gray-100 text-gray-800 text-base font-medium border-l border-gray-300 disabled:opacity-50 hover:bg-gray-200 transition-colors"
           >
             {loading && !isLoyaltyApplied ? t("applying") || "Applying..." : t("apply") || "Apply"}
           </button>
        )}
      </div>

      {preview && !isLoyaltyApplied && (
        <p className="text-sm text-gray-600 mb-4 px-1">
          {t("loyalty_points_available") || "Points available"}:{" "}
          <strong>{Number(preview.points ?? 0).toFixed(2)}</strong>
          {preview.discount > 0 && (
            <>
              {" "}
              · {t("promoDiscount") || "Discount"}: {setting?.currency}
              {Number(preview.discount).toFixed(
                setting?.decimal_point ?? 2
              )}
            </>
          )}
        </p>
      )}

      {cards.length > 0 && (
        (() => {
          const bestCard = cards.reduce((prev, current) => (prev.points > current.points ? prev : current), cards[0]);
          if (!bestCard || bestCard.points <= 0) return null;

          return (
            <div className="border border-gray-400 rounded-md overflow-hidden shadow-sm">
              <div className="bg-[#d1d5db] px-4 py-3 flex justify-between items-center border-b border-gray-400">
                <span className="font-bold text-gray-900 text-[15px]">{t("loyalty_points_label") || "Loyalty point(s)"}</span>
                <span className="font-bold text-gray-900 text-[15px]">{Number(bestCard.points).toFixed(2)}</span>
              </div>
              <div className="bg-white px-4 py-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-[15px] mb-1">{t("loyalty_reward") || "Loyalty Reward"}</h4>
                  <p className="text-gray-700 text-[15px]">
                    {t("discount") || "Discount"}: {setting?.currency}{Number(bestCard.discount).toFixed(setting?.decimal_point ?? 2)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={isLoyaltyApplied ? handleClear : () => handleApplyCard(bestCard.id)}
                  disabled={loading}
                  className={isLoyaltyApplied
                    ? "px-6 py-2.5 bg-red-500 text-white font-medium text-[15px] rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm"
                    : "px-6 py-2.5 bg-[#22c55e] text-white font-medium text-[15px] rounded-md hover:bg-[#16a34a] transition-colors disabled:opacity-50 shadow-sm"}
                >
                  {loading && isLoyaltyApplied ? t("removing") || "Removing..." : (loading ? t("applying") || "Applying..." : (isLoyaltyApplied ? t("remove") || "Remove" : t("claim") || "Claim"))}
                </button>
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};

export default CheckoutPromoLoyalty;
