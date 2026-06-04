import { t } from "@/utils/translation";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { setCheckoutTotal } from "@/redux/slices/checkoutSlice";
import { useDispatch } from "react-redux";
import { CgInfo } from "react-icons/cg";
import ChargesInfoPopup from "./ChargesInfoPopup";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";

const OrderSummaryCard = ({
  step,
  checkoutData,
  handlePlaceOrder,
  checkOutError,
  checkoutLoading,
}) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting.setting);
  const user = useSelector((state) => state.User);
  const checkout = useSelector((state) => state.Checkout);
  const cart = useSelector((state) => state.Cart);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [message, setMessage] = useState("");

  const decimalPoint = setting?.decimal_point ?? 2;
  const currency = setting?.currency || "AED";

  const formatAmount = (value) =>
    Number(value || 0).toFixed(decimalPoint);

  const cartItems = useMemo(() => {
    const items = checkoutData?.cart?.length
      ? checkoutData.cart
      : cart?.cartProducts || cart?.cart || [];
    const itemsArray = Array.isArray(items) ? items : [];
    return itemsArray.filter((item) => {
      const itemName = item?.name?.toLowerCase() || "";
      return itemName !== "loyalty reward" && item?.name !== (t("loyalty_reward") || "Loyalty Reward");
    });
  }, [checkoutData?.cart, cart?.cartProducts, cart?.cart]);

  const deliveryAmount = useMemo(() => {
    if (checkOutError) return 0;
    if (
      typeof checkoutData?.delivery_charge === "object" &&
      checkoutData?.delivery_charge !== null
    ) {
      return Number(checkoutData.delivery_charge.total_delivery_charge || 0);
    }
    return Number(checkoutData?.delivery_charge || 0);
  }, [checkOutError, checkoutData?.delivery_charge]);

  const promoDiscount = useMemo(() => {
    if (checkOutError) return 0;
    return Number(
      checkoutData?.promocode_details?.discount || cart?.promo_code?.discount || 0
    );
  }, [checkOutError, checkoutData?.promocode_details?.discount, cart?.promo_code?.discount]);

  const summaryTotals = useMemo(() => {
    if (checkOutError) {
      const fallback = Number(cart?.cartSubTotal || 0);
      return {
        subTotal: fallback,
        taxAmount: 0,
        deliveryAmount: 0,
        promoDiscount: 0,
        total: fallback,
      };
    }

    const subTotal = Number(
      checkoutData?.amount_untaxed ?? checkoutData?.sub_total ?? 0
    );
    const taxAmount = Number(checkoutData?.tax_amount || 0);
    const total = Number(checkoutData?.total_amount || 0);

    return {
      subTotal,
      taxAmount,
      deliveryAmount,
      promoDiscount,
      total,
    };
  }, [
    checkOutError,
    cart?.cartSubTotal,
    checkoutData?.amount_untaxed,
    checkoutData?.sub_total,
    checkoutData?.tax_amount,
    checkoutData?.total_amount,
    deliveryAmount,
    promoDiscount,
  ]);

  useEffect(() => {
    if (checkout?.isWalletChecked) {
      const updatedTotal = Math.max(
        (summaryTotals.total || 0) - (user?.user?.balance || 0),
        0
      );
      dispatch(setCheckoutTotal({ data: updatedTotal }));
    } else {
      dispatch(setCheckoutTotal({ data: summaryTotals.total || 0 }));
    }
  }, [
    checkout?.isWalletChecked,
    summaryTotals.total,
    user?.user?.balance,
    dispatch,
  ]);

  return (
    <div className="w-full mx-auto cardBorder rounded-lg p-6 ">
      {cartItems.length > 0 && (
        <div className="mb-4">
          <h3 className="font-bold text-base mb-3">
            {t("order_summary")} ({cartItems.length} {t("items")})
          </h3>
          <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
            {cartItems.map((item) => {
              const qty = Number(item?.qty ?? item?.quantity ?? 1);
              const unitPrice = Number(item?.price ?? item?.discounted_price ?? 0);
              const lineTax = Number(item?.tax_amount || 0);
              const lineTotal = Number(
                item?.line_total ?? item?.sub_total ?? unitPrice * qty
              );

              return (
                <div
                  key={item?.order_line_id || item?.id || item?.product_variant_id}
                  className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                >
                  <div className="relative h-14 w-14 flex-shrink-0 rounded-md overflow-hidden backgroundColor">
                    <ImageWithPlaceholder
                      src={item?.image_url}
                      alt={item?.name}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 leading-snug">
                      {item?.name}
                    </p>
                    <p className="text-xs subTextColor mt-1">
                      {qty} x {currency} {formatAmount(unitPrice)}
                    </p>
                    {lineTax > 0 && (
                      <p className="text-xs subTextColor">
                        {t("tax")}: + {currency} {formatAmount(lineTax)}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">
                    {currency} {formatAmount(lineTotal)}
                  </div>
                </div>
              );
            })}
          </div>
          <hr className="border-gray-300 my-4" />
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <span className="font-bold ">{t("sub_total")}</span>
        <span className="font-semibold ">
          {currency} {formatAmount(summaryTotals.subTotal)}
        </span>
      </div>

      {checkoutData?.additional_charges?.length > 0
        ? checkoutData?.additional_charges?.map((charge, index) => {
            return (
              <div
                className="flex justify-between items-center my-2"
                key={index}
              >
                <span className="flex items-center relative">{charge?.title} <span className="ml-1 subTextColor cursor-pointer" onClick={() => {
                  setMessage(charge?.is_refundable ? t("refundable_message") : t("non_refundable_message"));
                  setActiveTooltip(index);
                }}><CgInfo /></span>
                  {activeTooltip === index && (
                    <ChargesInfoPopup message={message} onClose={() => setActiveTooltip(null)} />
                  )}
                </span>
                <span className="font-semibold">
                  {setting?.currency}
                  {charge?.amount}
                </span>
              </div>
            );
          })
        : null}
      {checkOutError == false && checkout?.orderType == "doorstep" && (
        <div className="flex justify-between items-center mb-2">
          <span className="flex items-center wrap relative">
            <span className="flex flex-wrap">{t("delivery_charge")}</span>
            {checkoutData?.delivery_charge?.sellers_info?.length > 0 && (
              <span className="ml-1 subTextColor cursor-pointer" onClick={()=>{
                setMessage(
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">{t("delivery_charge_details")}</span>
                    {checkoutData?.delivery_charge?.sellers_info?.map((seller, i) => (
                      <div key={i} className="flex justify-between items-center text-xs gap-4">
                        <span className="">{seller.seller_name}</span>
                        <span className="font-medium whitespace-nowrap">{setting?.currency} {seller.delivery_charge}</span>
                      </div>
                    ))}
                  </div>
                );
                setActiveTooltip('delivery');
              }}><CgInfo /></span>
            )}
            {activeTooltip === 'delivery' && (
              <ChargesInfoPopup message={message} onClose={() => setActiveTooltip(null)} />
            )}
          </span>
          <span className=" flex flex-nowrap">
            <span>{setting?.currency}{" "}</span>
            <span>
            {typeof checkoutData?.delivery_charge === 'object' && checkoutData?.delivery_charge !== null
              ? checkoutData?.delivery_charge?.total_delivery_charge
              : checkoutData?.delivery_charge ?? 0}
            </span>
          </span>
        </div>
      )}

      {checkOutError == false && summaryTotals.taxAmount > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{t("tax") || "Tax / VAT"}</span>
          <span className="">
            + {currency} {formatAmount(summaryTotals.taxAmount)}
          </span>
        </div>
      )}

      {promoDiscount > 0 && checkOutError == false && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">
            {t("promoDiscount")}
          </span>
          <span className="">
            - {currency} {formatAmount(promoDiscount)}
          </span>
        </div>
      )}
      {checkout?.isWalletChecked && (
        <div className="flex justify-between items-center mb-2">
          {t("wallet_balance_used")}

          <span className="">
            - {setting?.currency}{" "}
            {checkout?.usedWalletBalance?.toFixed(
              setting?.decimal_point ? setting?.decimal_point : 0
            )}
          </span>
        </div>
      )}
      <hr className="border-gray-300 mb-4" />
      <div className="flex justify-between items-center mb-6 backgroundColor p-3 rounded-sm">
        <span className="text-lg font-bold ">{t("total")}</span>
        <span className="font-semibold ">
          {currency}{" "}
          {checkout?.isWalletChecked
            ? formatAmount(
                Number(summaryTotals.total) - Number(checkout?.usedWalletBalance)
              )
            : formatAmount(summaryTotals.total)}
        </span>
      </div>
      <button
        className="w-full primaryBackColor text-white font-semibold py-2 rounded-md  disabled:iconBackgroundColor disabled:cursor-not-allowed disabled:fontColor"
        disabled={step !== 3 || checkoutLoading}
        onClick={handlePlaceOrder}
      >
        {checkoutLoading ? (t("processing") || "Processing...") : t("place_order")}
      </button>
      <div className="text-center rounded w-full hover:primaryBackColor hover:text-white p-2 mt-2">
        <Link href="/cart" className=" underline font-medium  w-full ">
          {t("backToCart")}
        </Link>
      </div>
      {/* Global popup removed since we render tooltips inline */}
    </div>

  );
};

export default OrderSummaryCard;
