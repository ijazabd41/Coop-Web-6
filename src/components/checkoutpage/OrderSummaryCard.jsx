import { t } from "@/utils/translation";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const OrderSummaryCard = ({ checkoutData, handlePlaceOrder }) => {
    const setting = useSelector(state => state.Setting.setting)
    // const cart = useSelector(state=>)
    return (
        <div className="w-full mx-auto cardBorder rounded-lg p-6 ">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold ">Subtotal</span>
                <span className="font-semibold text-gray-900">{setting?.currency} {checkoutData?.sub_total?.toFixed(2)}</span>
            </div>


            {checkoutData?.promocode_details && (
                <div className="flex justify-between items-center mb-2">
                    <a href="#" className="">
                        {t("promoDiscount")}
                    </a>
                    <span className="">- {setting?.currency} {checkoutData?.promocode_details?.discount}</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <span className="">{t("delivery_charge")}</span>
                <span className="">{setting?.currency} {checkoutData?.delivery_charge?.total_delivery_charge}</span>
            </div>
            <hr className="border-gray-300 mb-4" />

            <div className="flex justify-between items-center mb-6 backgroundColor p-3 rounded-sm">
                <span className="text-lg font-bold ">{t("total")}</span>
                <span className="text-lg font-bold ">{setting?.currency} {checkoutData?.total_amount?.toFixed(2)}</span>
            </div>

            <button className="w-full primaryBackColor text-white font-semibold py-2 rounded-md  " onClick={handlePlaceOrder}>
                {t("place_order")}
            </button>

            <div className="text-center rounded w-full hover:primaryBackColor hover:text-white p-2 mt-2">
                <Link href="/cart" className=" underline font-medium  w-full ">
                    {t("backToCart")}
                </Link>
            </div>
        </div>
    );
};

export default OrderSummaryCard;
