import React from 'react'
import { t } from "@/utils/translation"

const WalletHistory = () => {
    return (
        <div>
            <div className='w-full cardBorder rounded-sm '>
                <div className='buttonBackground flex justify-between p-4 items-center'>
                    <h2 className='font-bold text-xl'>{t("wallet_history")}</h2>
                </div>
                <div>
                    <div className='grid grid-cols-12'>
                        <div className='col-span-6'>
                            <div className="border rounded-lg cardBorder p-4 m-4 ">
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

                                {/* Message Section */}
                                <div className="border-t pt-3 mb-4">
                                    <p className="font-semibold  mb-1">Message</p>
                                    <p className="font-bold  leading-snug">
                                        Order Placed ID:5310 Order amount paid by Wallet
                                    </p>
                                </div>

                                {/* Transaction Amount Section */}
                                <div className=" p-3 rounded-lg flex justify-between items-center backgroundColor">
                                    <div>
                                        <p className=" text-sm">Transaction Amount</p>
                                        <p className="text-2xl font-bold">$1,550.00</p>
                                    </div>
                                    <div>
                                        <span className="border border-red-500 text-red-500 font-bold text-sm py-1 px-2 rounded">
                                            Debit
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletHistory