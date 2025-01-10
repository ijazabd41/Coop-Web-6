import { t } from '@/utils/translation'
import React from 'react'
import { useSelector } from 'react-redux'

const FinalCheckoutSummary = ({ orderDetail }) => {

    const setting = useSelector(state => state.Setting.setting)

    return (
        <div className="max-w-md p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg  font-medium">{t("payment_method")}</h2>
                <span className="font-medium">{orderDetail?.payment_method}</span>
            </div>

            <div className="space-y-4">
                <div className="space-y-4">
                    {orderDetail?.transaction_id != 0 && <div className="flex justify-between items-center">
                        <span className="">{t("transaction_id")}</span>
                        <span>{orderDetail?.transaction_id}</span>
                    </div>}



                    <div className="flex justify-between items-center">
                        <span className="">{t("sub_total")}</span>
                        <span>{setting?.currency}{orderDetail?.total}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="">{t("delivery_charge")}</span>
                        <span>{setting?.currency}{orderDetail?.delivery_charge}</span>
                    </div>

                    <div className="pt-4 border-t ">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-base">{t("total")} {t("amount")}</span>
                            <span className="text-green-600">{setting?.currency}{orderDetail?.final_total}</span>
                        </div>
                    </div>
                </div >
            </div >
        </div>
    )
}

export default FinalCheckoutSummary