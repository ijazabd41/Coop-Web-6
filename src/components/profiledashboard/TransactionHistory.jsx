import { t } from '@/utils/translation'
import React from 'react'
import PayPalLogo from "@/assets/payment_methods_svgs/ic_paypal.svg"
import Image from 'next/image'

const TransactionHistory = () => {
    return (
        <div>
            <div className='w-full cardBorder rounded-sm '>
                <div className='buttonBackground flex justify-between p-4 items-center'>
                    <h2 className='font-bold text-xl'>{t("transaction_history")}</h2>
                </div>
                <div className='grid grid-cols-12'>
                    <div className='col-span-6'>
                        <div className="border rounded-lg  cardBorder p-4 m-4">
                            {/* Header: Transaction ID and Date */}
                            <div className="flex justify-between  text-sm mb-3">
                                <div>
                                    <p className="font-semibold">Transaction ID</p>
                                    <p className=" font-bold">#271</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">Date</p>
                                    <p className="">5-12-2024, 3:36:00 PM</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="flex items-center gap-2 border-t pt-3 pb-3">
                                <Image
                                    src={PayPalLogo}
                                    alt="PayPal"
                                    className="h-10 w-10"
                                    height={0}
                                    width={0}
                                />
                                <div>
                                    <p className=" text-sm">Payment Method</p>
                                    <p className=" font-semibold">Paypal</p>
                                </div>
                            </div>

                            {/* Transaction Amount Section */}
                            <div className=" p-3 rounded-lg flex justify-between items-center backgroundColor">
                                <div>
                                    <p className=" text-sm">Transaction Amount</p>
                                    <p className="text-2xl font-bold">$1,550.00</p>
                                </div>
                                <div>
                                    <span className="border border-green-500 text-green-500 font-bold text-sm py-1 px-2 rounded">
                                        Success
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-6'></div>

                </div>
            </div>
        </div>
    )
}

export default TransactionHistory