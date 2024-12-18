import React, { useState } from 'react';
import Image from 'next/image';
import { CiWallet } from 'react-icons/ci';
import { useSelector } from 'react-redux'
import { t } from "@/utils/translation"

import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg"
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg"
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg"
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg"
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg"
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg"
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg"
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg"


const CheckoutPayment = () => {
    const setting = useSelector(state => state.Setting)

    const [selectedPaymentMethod, setSelectPaymentMethod] = useState()

    const handleSelectedPaymentMethod = (value) => {
        setSelectPaymentMethod(value)
    }


    return (
        <div>
            <div className='flex flex-col cardBorder rounded-sm mb-4 w-full '>
                <div className='flex  justify-between backgroundColor p-4'>
                    <span className='font-bold text-xl'>{t("choose_payment_method")}</span>
                </div>
                <div className='p-4 flex flex-col gap-2'>
                    <div className='flex flex-col gap-3 mb-3'>
                        <div className=' flex justify-between'>
                            <p className='text-base font-bold'>{t("your_wallet")}</p>
                            <div className='flex gap-2 items-center'><input type="checkbox" name="" id="" className='h-4 w-4' /><p>{t("use_wallet_balance")}</p></div>
                        </div>
                        <div className='rounded backgroundColor flex justify-between items-center p-2'>
                            <div className='flex gap-4 items-center font-medium text-base'><CiWallet size={40} className='bg-[#55ae7b26] p-1 rounded-sm' />{t("walletBalance")}</div>
                            <div className='font-bold text-xl'>$2310.00</div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1 className='text-base font-bold'>{t("payment_method")}</h1>
                        <div className='flex flex-col gap-2'>
                            {setting?.payment_setting?.razorpay_payment_method == 1 &&
                                <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "razorpay" ? "bg-[#55ae7b26]" : ''}`}>
                                    <div className='flex gap-2 items-center'>
                                        <Image src={RazorpayImage} className='h-8 w-8 ' height={0} width={0} alt={t("razorpay")} />
                                        <p className='font-medium text-base'>{t("razorpay")}</p>
                                    </div>
                                    <div>
                                        <input type="radio" name="wallet_method" className='h-6 w-6 mt-2 ' onChange={() => handleSelectedPaymentMethod("razorpay")} />
                                    </div>
                                </div>
                            }
                            {setting?.payment_setting?.paypal_payment_method == 1 &&
                                <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "paypal" ? "bg-[#55ae7b26]" : ''}`}>
                                    <div className='flex gap-2 items-center'>
                                        <Image src={PaypalImage} className='h-8 w-8 ' height={0} width={0} alt={t("paypal")} />
                                        <p className='font-medium text-base'>{t("paypal")}</p>
                                    </div>
                                    <div>
                                        <input type="radio" name="wallet_method" className='h-6 w-6 mt-2' onChange={() => handleSelectedPaymentMethod("paypal")} />
                                    </div>
                                </div>
                            }
                        </div>
                        <div className='flex justify-end gap-4'>
                            <button className='cardBorder px-4 py-2 rounded-sm text-xl font-normal'>{t("previous")}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPayment