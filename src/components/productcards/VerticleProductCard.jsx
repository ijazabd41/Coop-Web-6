import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaRegHeart, FaRegEye, FaRegStar, FaStar, FaShoppingBasket } from "react-icons/fa";
import Link from 'next/link';
import { t } from "@/utils/translation"
import { MdArrowDropDown } from "react-icons/md";
import VariantsModal from '../variantsmodal/VariantsModal'
import ProductDetailModal from '../productdetailmodal/ProductDetailModal';

const VerticleProductCard = ({ product }) => {

    const [selectedVariant, setSelectedVariant] = useState([])
    const [showVariants, setShowVariants] = useState(false)
    const [showProductDetail, setShowProductDetail] = useState(false)

    useEffect(() => {
        setSelectedVariant(product?.variants?.[0])
    }, [])

    const calculateDiscount = (discountPrice, actualPrice) => {
        const difference = actualPrice - discountPrice;
        const actualDiscountPrice = (difference / actualPrice)
        return actualDiscountPrice * 100;
    }

    const handleShowVariantModal = (product) => {
        if (product.variants.length > 1) {
            setShowVariants(true)
        } else {
            return
        }
    }

    const handleShowDetailModal = () => {
        setShowProductDetail(true)
    }

    const productsVariants = product.variants

    return (
        <div>
            <div className='flex flex-col p-2 border-[1px] group rounded-md headerBackgroundColor textColor'>
                <div className='flex relative textColor'>
                    <div className='relative aspect-square w-full '>
                        <Image className='rounded-lg object-cover ' fill alt={product.name} src={product.image_url} />
                        {selectedVariant?.discounted_price !== 0 ? <span class="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-bold left-0 leading-[16px] px-2 py-1 absolute text-center uppercase top-0">
                            {calculateDiscount(selectedVariant?.discounted_price, selectedVariant?.price).toFixed(0)}% {t("off")}
                        </span> : null}
                        <ul className="absolute right-5 top-5 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                            <li className='buttonBorder rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegHeart size={18} className='fontColor' /></Link></li>
                            <li className='buttonBorder  rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><div onClick={handleShowDetailModal} ><FaRegEye size={18} className='fontColor' /></div></li>
                        </ul>
                    </div>
                </div>
                <div className='h-[100px] flex flex-col justify-between '>

                    <h3 className="flex textColor text-[16px] font-bold leading-[1.2] mt-3 max-h-[2.4em] overflow-hidden text-ellipsis capitalize w-full group-hover:primaryColor">{product?.name}</h3>
                    {product?.average_rating > 0 ?
                        <div className="rating">
                            <div className="flex">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        return (
                                            <FaStar
                                                key={star}
                                                size={15}
                                                className={`${star <= parseInt(product?.average_rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                    }`}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        : null}
                    <div className='flex'>
                        {selectedVariant?.discounted_price !== 0 ? <>  <p className='textColortext-base font-bold'>₹{productsVariants?.[0]?.discounted_price}</p>
                            <p className='textColor text-[14px] font-normal leading-[17px] m-1 line-through'>₹{productsVariants[0]?.price}</p></> : <p className='textColor text-base font-bold'>₹{productsVariants?.[0]?.price}</p>}
                    </div>
                </div>
                <div className='flex gap-0 md:gap-3 h-[80px] md:h-[38px] w-full flex-col md:flex-row'>
                    <button onClick={() => handleShowVariantModal(product)} className='md:w-1/2 w-full flex items-center my-[5px] justify-between px-2 rounded-[4px] p-[5px] buttonBackground ' >{`${productsVariants?.[0]?.measurement} ${productsVariants?.[0]?.stock_unit_name}`}{productsVariants?.length > 1 ? <div><MdArrowDropDown size={22} /></div> : <></>}</button>
                    <button className='w-full md:w-1/2 flex gap-1 text-base my-[5px] items-center  justify-center rounded-[4px] p-[5px] text-white bg-[#55ae7b26] primaryColor'><FaShoppingBasket size={20} /><span>Add</span></button>
                </div>
            </div >
            <VariantsModal product={product} showVariants={showVariants} setShowVariants={setShowVariants} />
            <ProductDetailModal product={product} showDetailModal={showProductDetail} setShowDetailModal={setShowProductDetail} />
        </div >
    )
}

export default VerticleProductCard;
