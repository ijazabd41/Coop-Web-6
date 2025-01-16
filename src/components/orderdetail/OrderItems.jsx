import { t } from '@/utils/translation';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CancelReasonModal from './CancelReasonModal';
import ReturnReasonModal from './ReturnReasonModal';
import { FaStar } from 'react-icons/fa';
import { MdOutlineStar } from 'react-icons/md';
import ProductRatingModal from './ProductRatingModal';
import { rating } from '@/api/apiEndpoints';
import { IoMdStar } from 'react-icons/io';
import RatingUpdateModal from './RatingUpdateModal';

const OrderItems = ({ products, handleFetchOrderDetail }) => {

    const setting = useSelector(state => state.Setting.setting)
    const user = useSelector(state => state.User.user)

    const [selectedProduct, setSelectedProduct] = useState([])
    const [showCancelMoodal, setShowCancelModal] = useState(false)
    const [showReturnModal, setShowReturnModal] = useState(false)
    const [showRating, setShowRating] = useState(false)
    const [showUpdateRating, setShowUpdateRating] = useState(false)
    const [ratingId, setRatingId] = useState(null)

    const handleCancel = (product) => {
        setSelectedProduct(product)
        setShowCancelModal(true)
    }

    const handleReturn = (product) => {
        setSelectedProduct(product)
        setShowReturnModal(true)
    }

    const handleShowRating = (product) => {
        setSelectedProduct(product)
        setShowRating(true)
    }

    const handleShowUpdateRating = (product) => {

        const rating = product?.item_rating?.find((rating) => rating?.user_id == user?.id)
        const ratingId = rating?.id
        setRatingId(ratingId)
        setShowUpdateRating(true)
    }

    return (
        <div className="rounded-md cardBorder overflow-scroll md:overflow-hidden">
            <table className="table-auto w-full rounded-md">
                <thead className="backColor ">
                    <tr>
                        <th className="text-left p-4 border-b ">{t("product")}</th>
                        <th className="text-left p-4 border-b ">{t("price")}</th>
                        <th className="text-left p-4 border-b ">{t("total")}</th>
                        <th className="text-left p-4 border-b ">{t("action")}</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => {
                        const userRating = product?.item_rating?.find((rating) => rating?.user?.id === user?.id)
                        return (
                            <tr key={product?.id} className="border-b last:border-b-0 ">
                                <td className="p-4 flex items-center gap-4">
                                    <Image src={product?.image_url} alt='Products' className="w-12 h-12 backColor rounded-md" height={0} width={0} />
                                    <div>
                                        <p className="font-bold">{product?.name}</p>
                                        <p className="text-sm ">{`${product?.variant_name} x ${product?.quantity}`}</p>
                                    </div>
                                </td>
                                <td className="p-4">

                                    <p className="font-bold">{setting?.currency}
                                        {product?.price?.toFixed(2)}
                                    </p>
                                    {/* {product?.discounted_price != 0 && <p className="text-sm  line-through">{setting?.currency}
                                    {product?.price?.toFixed(2)}
                                </p>} */}
                                </td>
                                <td className="p-4 font-bold">{setting?.currency}{product?.sub_total?.toFixed(2)}</td>
                                <td className="p-4 ">
                                    <div className='flex gap-2'>
                                        <div className=''>
                                            {Number(product?.active_status) <= 6 &&
                                                Number(product?.active_status) < Number(product?.till_status) &&
                                                Number(product?.cancelable_status) === 1 && (
                                                    <button
                                                        className="px-4 py-2 text-red-500 bg-[#DB3D261F] rounded-md hover:bg-red-200"
                                                        onClick={() => handleCancel(product)}
                                                    >
                                                        {t("cancel")}
                                                    </button>
                                                )}

                                            {Number(product?.active_status) === 6 &&
                                                Number(product?.return_status) === 1 &&
                                                product?.return_requested === null && (
                                                    <button
                                                        className="px-4 py-2 text-orange-500 bg-[#ffc1071f] rounded-md hover:bg-[#eacd761f]"
                                                        onClick={() => handleReturn(product)}
                                                    >
                                                        {t("return")}
                                                    </button>
                                                )}

                                            {Number(product?.active_status) === 7 && (
                                                <button
                                                    className="px-4 py-2 text-red-500 bg-[#DB3D261F] rounded-md"
                                                    disabled
                                                >
                                                    {t("cancelled")}
                                                </button>
                                            )}

                                            {Number(product?.active_status) === 8 && (
                                                <button
                                                    className="px-4 py-2 text-orange-500 bg-[#ffc1071f] rounded-md "
                                                >
                                                    {t("returned")}
                                                </button>
                                            )}

                                            {Number(product?.return_requested) === 1 && (
                                                <button
                                                    className="px-4 py-2 text-orange-500 bg-[#ffc1071f] rounded-md "
                                                >
                                                    {t("return_requested")}
                                                </button>
                                            )}

                                            {Number(product?.return_requested) === 3 && (
                                                <button
                                                    className="px-4 py-2 text-red-500 bg-[#ffc1071f] rounded-md "
                                                >
                                                    {t("return_rejected")}
                                                </button>
                                            )}
                                        </div>
                                        {(Number(product?.active_status) === 6 && product?.return_requested === null) ?
                                            userRating ?
                                                <div className='flex items-center flex-col px-1 cursor-pointer' onClick={() => handleShowUpdateRating(product)} >
                                                    {t("you_rated")}<span className='font-bold flex items-center '><IoMdStar size={20} />{userRating?.rate}</span>
                                                </div>
                                                :
                                                <div>
                                                    <button className='px-4 py-2 hover:bg-[#6ac8931f] text-[#55AE7B] bg-[#55AE7B1F] rounded-md flex gap-1 items-center font-medium text-base' onClick={() => handleShowRating(product)}><MdOutlineStar size={20} />{t("rate")}</button>
                                                </div> : <></>}

                                    </div>

                                </td>

                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <CancelReasonModal showCancelMoodal={showCancelMoodal} setShowCancelModal={setShowCancelModal} selectedProduct={selectedProduct} handleFetchOrderDetail={handleFetchOrderDetail} />
            <ReturnReasonModal showReturnModal={showReturnModal} setShowReturnModal={setShowReturnModal} selectedProduct={selectedProduct} handleFetchOrderDetail={handleFetchOrderDetail} />
            <ProductRatingModal showRating={showRating} setShowRating={setShowRating} selectedProduct={selectedProduct} handleFetchOrderDetail={handleFetchOrderDetail} />
            <RatingUpdateModal ratingId={ratingId} showUpdateRating={showUpdateRating} setShowUpdateRating={setShowUpdateRating} handleFetchOrderDetail={handleFetchOrderDetail} />
        </div>
    );
};

export default OrderItems;
