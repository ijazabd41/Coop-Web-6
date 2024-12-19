import Image from 'next/image'
import React from 'react'
import Demo from "/public/demo.png"
import { IoClose } from 'react-icons/io5'
import { TiMinus, TiPlus } from "react-icons/ti";
import { useSelector } from 'react-redux';

const CartProductsCard = ({ product }) => {
    const setting = useSelector(state => state.Setting.setting)
    return (
        <div>
            <div className='grid grid-cols-12 p-2 cardBorder mx-2 my-1 gap-2 rounded-sm '>
                <div className='col-span-3 '>
                    <div className='h-full w-full object-cover aspect-square relative'>
                        <Image src={product?.image_url} alt='Image' fill className='h-full w-full object-cover' />
                    </div>
                </div>
                <div className='col-span-9'>
                    <div className='flex flex-col justify-between h-full'>
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-ellipsis overflow-hidden w-full line-clamp-2">
                                {product?.name}
                            </h2>
                            <IoClose size={20} />
                        </div>

                        <div>
                            <span className='flex items-center gap-1'>{product?.measurement} {product?.unit_code}</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <div className='flex border-2 items-center leading-5 w-1/2 justify-between p-1 rounded-sm'>
                                <button className='text-2xl font-bold px-1'><TiMinus /></button>
                                <span className='w-full text-center'>120</span>
                                <button className='text-2xl font-bold px-1'><TiPlus /></button>
                            </div>
                            <div className='flex gap-1 items-center'>
                                {product?.discounted_price == 0 ? <> <h2 className='text-base font-bold'> {setting?.currency}{product?.price}</h2>
                                    <p className='text-sm font-normal line-through'>{setting?.currency} {product?.price}</p></> : <h2 className='text-base font-bold'>{setting?.currency} {product?.discounted_price}</h2>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartProductsCard