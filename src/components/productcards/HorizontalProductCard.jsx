import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaRegEye, FaRegHeart, FaShoppingBasket, FaStar } from 'react-icons/fa'
import { t } from "@/utils/translation"

const HorizontalProductCard = ({ product }) => {

    const [selectedVariant, setSelectedVariant] = useState([])

    useEffect(() => {
        setSelectedVariant(product?.variants?.[0])
    }, [])

    const calculateDiscount = (discountPrice, actualPrice) => {
        const difference = actualPrice - discountPrice;
        const actualDiscountPrice = (difference / actualPrice)
        return actualDiscountPrice * 100;
    }

    return (
        <div>
            <div className='grid grid-cols-12 p-3 border-2 m-2  gap-1 group'>
                <div className='col-span-6'>
                    <div className='aspect-square w-full h-full relative'>
                        <Image className=' object-cover aspect-square' fill alt={product.name} src={product.image_url} />
                        {selectedVariant?.discounted_price !== 0 ? <span class="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-semibold left-0 leading-[16px] px-2 py-1 absolute text-center uppercase top-0">
                            {calculateDiscount(selectedVariant?.discounted_price, selectedVariant?.price).toFixed(0)}% {t("off")}
                        </span> : null}
                        <ul className="absolute right-5 top-5 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                            <li className='buttonBorder rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegHeart size={18} className='fontColor' /></Link></li>
                            <li className='buttonBorder  rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegEye size={18} className='fontColor' /></Link></li>
                        </ul>
                    </div>
                </div>
                <div className='col-span-6'>
                    <div className='flex flex-col  justify-between'>
                        <div className='flex flex-col h-[100px] justify-between'>
                            <h3 className="flex text-[#2a3640] text-[16px] font-semibold leading-[1.2]  max-h-[2.4em] overflow-hidden text-ellipsis capitalize w-full">{product?.name}</h3>
                            {product?.average_rating > 0 ?
                                <div className="rating">
                                    <div className="flex">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    size={15}
                                                    className={`${star <= rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'fill-gray-200 text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                : null}
                            <div className='flex'>
                                {selectedVariant?.discounted_price !== 0 ? <>  <p className='text-black text-base font-bold'>₹{product?.variants?.[0]?.discounted_price}</p>
                                    <p className='text-[#868c93] text-[14px] font-normal leading-[17px] m-1 line-through'>₹{product?.variants?.[0]?.price}</p></> : <p className='text-black text-base font-bold'>₹{product?.variants?.[0]?.price}</p>}
                            </div>
                        </div>
                        <div className='flex gap-3  w-full flex-col '>
                            <button className=' w-full flex items-center justify-center rounded-[4px] p-2 buttonBackground '>{`${product?.variants?.[0]?.measurement} ${product?.variants?.[0]?.stock_unit_name}`}</button>
                            <button className='w-full  flex gap-1 text-base  items-center  justify-center rounded-[4px] p-2 text-white bg-[#55ae7b26] primaryColor'><FaShoppingBasket size={20} /><span>Add</span></button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default HorizontalProductCard