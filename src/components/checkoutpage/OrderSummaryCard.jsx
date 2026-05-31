import { t } from "@/utils/translation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCheckoutTotal } from "@/redux/slices/checkoutSlice";
import { useDispatch } from "react-redux";
import { CgInfo } from "react-icons/cg";
import ChargesInfoPopup from "./ChargesInfoPopup";

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

  useEffect(() => {
    // Calculate new total amount based on wallet balance usage
    if (checkout?.isWalletChecked) {
      const updatedTotal = Math.max(
        (checkoutData?.total_amount || 0) - (user?.user?.balance || 0),
        0 // Ensure total doesn't go below 0
      );
      dispatch(setCheckoutTotal({ data: updatedTotal }));
    } else {
      dispatch(setCheckoutTotal({ data: checkoutData?.total_amount || 0 }));
      // setCheckoutTotal(checkoutData?.total_amount || 0); // Reset to original total
    }
  }, [
    checkout?.isWalletChecked,
    checkoutData?.total_amount,
    user?.user?.balance,
  ]);

  return (
    <div className="w-full mx-auto cardBorder rounded-lg p-6 ">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold ">{t("sub_total")}</span>
        {checkOutError == false ? (
          <span className="font-semibold ">
            {setting?.currency}{" "}
            {checkoutData?.sub_total?.toFixed(
              setting?.decimal_point ? setting?.decimal_point : 0
            )}
          </span>
        ) : (
          <span className="font-semibold ">
            {setting?.currency}{" "}
            {cart?.cartSubTotal?.toFixed(
              setting?.decimal_point ? setting?.decimal_point : 0
            )}
          </span>
        )}
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

      {checkOutError == false && Number(checkoutData?.tax_amount) > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{t("tax") || "Tax / VAT"}</span>
          <span className="">
            + {setting?.currency} {Number(checkoutData.tax_amount).toFixed(setting?.decimal_point ?? 2)}
          </span>
        </div>
      )}

      {(checkoutData?.promocode_details?.discount > 0 || cart?.promo_code?.discount > 0) && checkOutError == false && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">
            {t("promoDiscount")}
          </span>
          <span className="">
            - {setting?.currency} {Number(checkoutData?.promocode_details?.discount || cart?.promo_code?.discount || 0).toFixed(setting?.decimal_point ?? 2)}
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
        {checkOutError == false ? (
          <span className="font-semibold ">
            {setting?.currency}{" "}
            {checkout?.isWalletChecked
              ? (
                  Number(checkoutData?.total_amount) -
                  Number(checkout?.usedWalletBalance)
                ).toFixed(setting?.decimal_point ? setting?.decimal_point : 0)
              : checkoutData?.total_amount?.toFixed(
                  setting?.decimal_point ? setting?.decimal_point : 0
                )}
          </span>
        ) : (
          <span className="font-semibold ">
            {setting?.currency}{" "}
            {cart?.cartSubTotal?.toFixed(
              setting?.decimal_point ? setting?.decimal_point : 0
            )}
          </span>
        )}
      </div>
      <button
        className="w-full primaryBackColor text-white font-semibold py-2 rounded-md  disabled:iconBackgroundColor disabled:cursor-not-allowed disabled:fontColor"
        disabled={step !== 3 || checkoutLoading}
        onClick={handlePlaceOrder}
      >
        {t("place_order")}
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
