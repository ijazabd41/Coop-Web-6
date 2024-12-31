import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { t } from '@/utils/translation';
import Image from 'next/image';
import { useSelector } from 'react-redux';

// payment SVGS
import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg"
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg"
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg"
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg"
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg"
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg"
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg"
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg"
import { IoIosCloseCircle } from 'react-icons/io';


const WalletBalanceModal = ({ addWalletModal, setAddWalletModal }) => {

    const setting = useSelector(state => state.Setting)

    const [selectedPaymentMethod, setSelectPaymentMethod] = useState()

    const handleSelectedPaymentMethod = (value) => {
        setSelectPaymentMethod(value)
    }



    return (
        <div>
            <Dialog open={addWalletModal} onOpenChange={setAddWalletModal} className="bg-black h-full w-full">
                {addWalletModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
                )}
                <DialogContent >
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <h1 className='font-bold text-xl'>{t("add_to_wallet")}</h1>
                        <div>
                            <IoIosCloseCircle size={32} onClick={() => setAddWalletModal()} />
                        </div>
                    </DialogHeader>
                    <div >
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="" className='text-xl'>{t("amount")}</label>
                                <input type="number" placeholder={t("type_amount")} className='py-2 px-4 cardBorder rounded-sm outline-none text-xl placeholder:text-xl' />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <h1 className='font-bold text-base'>{t("choose_payment_method")}</h1>
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
                                    {setting?.payment_setting?.paystack_payment_method == 1 &&
                                        <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "paystack" ? "bg-[#55ae7b26]" : ''}`}>
                                            <div className='flex gap-2 items-center'>
                                                <Image src={PaystackImage} className='h-8 w-8 ' height={0} width={0} alt={t("paystack")} />
                                                <p className='font-medium text-base'>{t("paystack")}</p>
                                            </div>
                                            <div>
                                                <input type="radio" name="wallet_method" className='h-6 w-6 mt-2' onChange={() => handleSelectedPaymentMethod("paystack")} />
                                            </div>
                                        </div>
                                    }
                                    {setting?.payment_setting?.midtrans_payment_method == 1 &&
                                        <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "midtrans" ? "bg-[#55ae7b26]" : ''}`}>
                                            <div className='flex gap-2 items-center'>
                                                <Image src={MidtransImage} className='h-8 w-8 ' height={0} width={0} alt={t("midtrans")} />
                                                <p className='font-medium text-base'>{t("midtrans")}</p>
                                            </div>
                                            <div>
                                                <input type="radio" name="wallet_method" className='h-6 w-6 mt-2' onChange={() => handleSelectedPaymentMethod("midtrans")} />
                                            </div>
                                        </div>
                                    }
                                    {setting?.payment_setting?.phonepay_payment_method == 1 &&
                                        <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "phonepe" ? "bg-[#55ae7b26]" : ''}`}>
                                            <div className='flex gap-2 items-center'>
                                                <Image src={PhonePeImage} className='h-8 w-8 ' height={0} width={0} alt={t("phonepe")} />
                                                <p className='font-medium text-base'>{t("phonepe")}</p>
                                            </div>
                                            <div>
                                                <input type="radio" name="wallet_method" className='h-6 w-6 mt-2' onChange={() => handleSelectedPaymentMethod("phonepe")} />
                                            </div>
                                        </div>
                                    }
                                    {setting?.payment_setting?.paytabs_payment_method == 1 &&
                                        <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "paytabs" ? "bg-[#55ae7b26]" : ''}`}>
                                            <div className='flex gap-2 items-center'>
                                                <Image src={PaytabsImage} className='h-8 w-8 ' height={0} width={0} alt={t("paytabs")} />
                                                <p className='font-medium text-base'>{t("paytabs")}</p>
                                            </div>
                                            <div>
                                                <input type="radio" name="wallet_method" className='h-6 w-6 mt-2' onChange={() => handleSelectedPaymentMethod("paytabs")} />
                                            </div>
                                        </div>
                                    }
                                    {setting?.payment_setting?.cashfree_payment_method == 1 &&
                                        <div className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod == "cashfree" ? "bg-[#55ae7b26]" : ''}`}>
                                            <div className='flex gap-2 items-center'>
                                                <Image src={CashfreeImage} className='h-8 w-8 ' height={0} width={0} alt={t("cashfree")} />
                                                <p className='font-medium text-base'>{t("cashfree")}</p>
                                            </div>
                                            <div>
                                                <input type="radio" name="wallet_method" className='h-6 w-6 mt-2' onChange={() => handleSelectedPaymentMethod("cashfree")} />
                                            </div>
                                        </div>
                                    }
                                    <div className='pt-2 flex justify-end'>
                                        <button className='flex justify-end px-4 py-2 primaryBackColor mt-auto self-end text-white rounded-sm text-xl font-normal '>
                                            {t("add_money")}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default WalletBalanceModal;