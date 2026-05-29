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
    if (cart?.promo_code?.promo_code) {
      setCodeInput(cart.promo_code.promo_code);
      setPreview({
        points: cart.promo_code.points,
        discount: cart.promo_code.discount,
        promo_code: cart.promo_code.promo_code,
      });
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
        dispatch(setCartPromo({ data: res.data }));
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

  const handleApplyCard = async () => {
    if (!selectedCardId) return toast.error(t("please_select_reward"));
    const card = cards.find((c) => String(c.id) === String(selectedCardId));
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

  return (
    <div className="cardBorder p-4 rounded-lg backgroundColor my-4">
      <h3 className="font-bold text-lg mb-2">{t("have_coupon")}</h3>

      <div className="flex flex-col gap-2 mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            className="cardBorder p-2 rounded-sm w-full outline-none"
            placeholder={t("coupon")}
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleLookupCode}
            disabled={lookupLoading}
            className="cardBorder px-3 py-2 rounded-sm text-sm whitespace-nowrap"
          >
            {lookupLoading ? t("loading") : t("view_coupon")}
          </button>
        </div>
        {preview && (
          <p className="text-sm textColor">
            {t("loyalty_points_available")}:{" "}
            <strong>{preview.points ?? 0}</strong>
            {preview.discount > 0 && (
              <>
                {" "}
                · {t("promoDiscount")}: {setting?.currency}
                {Number(preview.discount).toFixed(
                  setting?.decimal_point ?? 2
                )}
              </>
            )}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleApplyCode}
            disabled={loading || !codeInput.trim()}
            className="primaryBackColor text-white px-4 py-2 rounded-sm disabled:opacity-50 text-sm"
          >
            {loading ? t("applying") : t("apply")}
          </button>
          {cart?.promo_code && (
            <button
              type="button"
              onClick={handleClear}
              className="cardBorder px-4 py-2 rounded-sm text-sm"
            >
              {t("delete")}
            </button>
          )}
        </div>
      </div>

      {cards.length > 0 && (
        <>
          <h4 className="font-semibold text-sm mb-2">{t("apply_loyalty_points")}</h4>
          <div className="flex gap-2 items-center">
            <select
              className="cardBorder p-2 rounded-sm w-full outline-none"
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
            >
              <option value="">{t("select_loyalty_card")}</option>
              {cards.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.promo_code} — {c.points} {t("loyalty_points_available")}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleApplyCard}
              disabled={loading || !selectedCardId}
              className="primaryBackColor text-white px-4 py-2 rounded-sm disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? t("applying") : t("apply")}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPromoLoyalty;
