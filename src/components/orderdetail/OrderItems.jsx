import { t } from '@/utils/translation';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CancelReasonModal from './CancelReasonModal';
import ReturnReasonModal from './ReturnReasonModal';

const OrderItems = ({ products }) => {

    const setting = useSelector(state => state.Setting.setting)

    const [selectedProduct, setSelectedProduct] = useState([])
    const [showCancelMoodal, setShowCancelModal] = useState(false)
    const [showReturnModal, setShowReturnModal] = useState(false)

    const handleCancel = (product) => {
        setSelectedProduct(product)
        setShowCancelModal(true)
    }

    return (
        <div className="rounded-md cardBorder">
            <table className="table-auto w-full rounded-md ">
                <thead className="backColor ">
                    <tr>
                        <th className="text-left p-4 border-b ">{t("product")}</th>
                        <th className="text-left p-4 border-b ">{t("price")}</th>
                        <th className="text-left p-4 border-b ">{t("total")}</th>
                        <th className="text-left p-4 border-b backColor">{t("action")}</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product?.id} className="border-b ">
                            <td className="p-4 flex items-center gap-4">
                                <Image src={product?.image_url} alt='Products' className="w-12 h-12 backColor rounded-md" height={0} width={0} />
                                <div>
                                    <p className="font-bold">{product?.name}</p>
                                    <p className="text-sm ">{`${product?.variant_name} x ${product?.quantity}`}</p>
                                </div>
                            </td>
                            <td className="p-4">
                                <p className="font-bold">{setting?.currency}
                                    {product?.discounted_price != 0 ? product?.discounted_price?.toFixed(2) : product?.price?.toFixed(2)}
                                </p>
                                {product?.discounted_price != 0 && <p className="text-sm  line-through">{setting?.currency}
                                    {product?.price?.toFixed(2)}
                                </p>}
                            </td>
                            <td className="p-4 font-bold">{setting?.currency}{product?.sub_total?.toFixed(2)}</td>
                            <td className="p-4">
                                {((Number(product?.active_status) < Number(product?.till_status)) && Number(product?.cancelable_status) == 1) && <button className="px-4 py-2 text-red-500 bg-[#DB3D261F] rounded-md hover:bg-red-200" onClick={() => handleCancel(product)}>
                                    {t("cancel_order")}
                                </button>}
                                {(Number(product?.return_status == 1) && product?.return_requested == null) ?
                                    <button className="px-4 py-2 text-blue-500 bg-[#917de01f] rounded-md hover:bg-blue-200" onClick={() => handleCancel(product)}>
                                        Return Order
                                    </button>
                                    : null
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <CancelReasonModal showCancelMoodal={showCancelMoodal} setShowCancelModal={setShowCancelModal} selectedProduct={selectedProduct} />
            <ReturnReasonModal showReturnModal={showReturnModal} setShowReturnModal={setShowReturnModal} />
        </div>
    );
};

export default OrderItems;
