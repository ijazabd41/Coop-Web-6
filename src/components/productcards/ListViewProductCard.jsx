import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { t } from "@/utils/translation"
import { FaRegEye, FaRegHeart, FaShoppingBasket, FaStar } from 'react-icons/fa'
import Link from 'next/link'

const ListViewProductCard = ({ product }) => {


  const [selectedVariant, setSelectedVariant] = useState(null)

  useEffect(() => {
    setSelectedVariant(product?.variants?.[0])
  }, [])

  const calculateDiscount = (discountPrice, actualPrice) => {
    const difference = actualPrice - discountPrice;
    const actualDiscountPrice = (difference / actualPrice)
    return actualDiscountPrice * 100;
  }


  return (
    <div >
      <div className='grid grid-cols-12 items-center w-full p-3 group border-2'>
        <div className='col-span-3'>
          <div className='relative h-full w-full aspect-square object-cover'>
            <Image src={product.image_url} fill alt={product.name} className='object-cover' />
            {selectedVariant?.discounted_price !== 0 ? <span class="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-bold left-0 leading-[16px] px-2 py-1 absolute text-center uppercase top-0">
              {calculateDiscount(selectedVariant?.discounted_price, selectedVariant?.price).toFixed(0)}% {t("off")}
            </span> : null}
            <ul className="absolute right-5 top-5 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
              <li className='buttonBorder rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegHeart size={18} className='fontColor' /></Link></li>
              <li className='buttonBorder  rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegEye size={18} className='fontColor' /></Link></li>
            </ul>
          </div>
        </div>
        <div className='col-span-7 px-2'>
          <div className='flex flex-col items-start justify-between h-[100px]'>
            <h3 className="flex text-[#2a3640] text-[16px] font-bold leading-[1.2] mt-3 max-h-[2.4em] overflow-hidden text-ellipsis capitalize w-full group-hover:primaryColor">{product?.name}</h3>
            {product?.average_rating > 0 ?
              <div className="rating">
                <div className="flex">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={15}
                        className={`${star <= product?.average_rating
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
        </div>
        <div className='col-span-2'>
          <div className='flex gap-0 md:gap-3  w-full flex-col '>
            <button className='w-1/2 md:w-full flex items-center my-[5px] justify-center rounded-[4px] p-[5px] buttonBackground '>{`${product?.variants?.[0]?.measurement} ${product?.variants?.[0]?.stock_unit_name}`}</button>
            <button className='md:w-full w-1/2 flex gap-1 text-base my-[5px] items-center  justify-center rounded-[4px] p-[5px] text-white bg-[#55ae7b26] primaryColor'><FaShoppingBasket size={20} /><span>Add</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListViewProductCard