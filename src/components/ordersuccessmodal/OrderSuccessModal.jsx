import React from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Lottie from 'lottie-react';
import animationOne from "@/assets/order_place_animation/order_placed_back_animation.json"
import animationTwo from "@/assets/order_place_animation/order_success_tick_animation.json"
import { t } from "@/utils/translation"

const OrderSuccessModal = ({ showOrderSuccess, handlePaymentClose }) => {
    return (
        <Dialog open={showOrderSuccess}>
            <DialogContent >
                <DialogHeader>


                    <div className='flex flex-col relative gap-8 '>
                        <Lottie className=' h-44  absolute left-0' animationData={animationOne} loop={true}></Lottie>
                        <Lottie className=' h-44 ' animationData={animationTwo} loop={false}></Lottie>
                        <Lottie className=' h-44  absolute right-0' animationData={animationOne} loop={true}></Lottie>
                        <div className='text-center mt-8'>

                            <h1 className='text-2xl'>{t("order_placed_description")}</h1>
                            <button className='mt-8 primaryBackColor text-white px-8 py-2 rounded-sm font-bold text-xl' onClick={handlePaymentClose}>
                                {t("home")}
                            </button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent >
        </Dialog >
    )
}

export default OrderSuccessModal