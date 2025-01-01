import { t } from '@/utils/translation'
import React from 'react'
import { useSelector } from 'react-redux'

const CartCouponCard = ({ setShowCouponCode }) => {


    const cart = useSelector(state => state.Cart);
    const setting = useSelector(state => state.Setting.setting)

    return (
        <div className="max-w-sm p-4  border  rounded-md cardBorder">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium ">{t("have_coupon")}</h3>
                <button className="px-3 py-1 text-sm font-medium border rounded hover:primaryBackColor hover:text-white" onClick={() => setShowCouponCode(true)}>
                    {t("view_coupon")}
                </button>
            </div>

            {/* Promo Code Section */}
            <div className="mb-4">
                <div className='flex justify-between items-center mb-4'>
                    <p className="text-sm ">Promo Code Applied</p>
                    <button className=" text-xs font-medium text-red-500 hover:primaryBackColor hover:text-white p-2 rounded-sm">
                        Remove
                    </button>
                </div>

                <div className="flex items-center justify-between p-1 mt-2 bg-[#55AE7B0A] border  rounded-md">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-600">💳</span>
                        <p className="text-sm font-medium text-green-600">BOGOZILLA</p>
                    </div>
                    <p className="text-sm font-medium text-green-600">$40.00</p>
                </div>

            </div>

            {/* Pricing Details */}
            <div className="mb-4">
                <div className="flex justify-between text-sm ">
                    <p>{t("sub_total")}</p>
                    <p>{setting?.currency} {cart?.cartSubTotal}</p>
                </div>

            </div>

            {/* Divider */}
            <hr className="mb-4 border-gray-300" />

            {/* Total */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold ">Total</p>
                <p className="text-lg font-semibold ">$5,310.00</p>
            </div>

            {/* Actions */}
            <button className="w-full py-2 mb-2 text-sm font-medium text-white primaryBackColor rounded ">
                Proceed to Checkout
            </button>
            <button className="w-full py-2 rounded-sm text-sm font-medium  hover:primaryBackColor">
                Continue Shopping
            </button>
        </div>
    )
}

export default CartCouponCard