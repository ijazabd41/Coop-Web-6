import React from "react";

const OrderSummaryCard = () => {
    return (
        <div className="w-full mx-auto cardBorder rounded-lg p-6 ">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold ">Subtotal</span>
                <span className="font-semibold text-gray-900">$5,025.00</span>
            </div>

            <div className="flex justify-between items-center mb-2">
                <span className="">Tax</span>
                <span className="">$325.00</span>
            </div>

            <div className="flex justify-between items-center mb-2">
                <a href="#" className="">
                    Promo Discount
                </a>
                <span className="">- $40.00</span>
            </div>


            <div className="flex justify-between items-center mb-4">
                <span className="">Delivery Charges</span>
                <span className="">$15.00</span>
            </div>

            <hr className="border-gray-300 mb-4" />


            <div className="flex justify-between items-center mb-6 backgroundColor p-3 rounded-sm">
                <span className="text-lg font-bold ">Total</span>
                <span className="text-lg font-bold ">$5,325.00</span>
            </div>

            <button className="w-full primaryBackColor text-white font-semibold py-2 rounded-md  ">
                Place Order
            </button>

            <div className="text-center mt-4">
                <a href="#" className=" underline font-medium ">
                    Back to Cart
                </a>
            </div>
        </div>
    );
};

export default OrderSummaryCard;
