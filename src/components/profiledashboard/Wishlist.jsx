import React from 'react'
import { t } from "@/utils/translation"
import DemoImage from "/public/demo.png"
import Image from 'next/image'
import { FaShoppingBasket } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'

const Wishlist = () => {
    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("wishlist")}</h2>
            </div>
            <div>
                <div className='cardBorder'>
                    <div className='p-4'>
                        <div className='p-4'>
                            <div className='grid grid-cols-12 '>
                                <div className='col-span-6 flex gap-2'>
                                    <div className='h-16 w-16'><Image src={DemoImage} alt='Image' height={0} width={0} className='object-cover h-full w-full rounded-sm' /></div>
                                    <div>
                                        <h2 className='font-bold text-base '>Farm Fresh Blueberries</h2>
                                        <p className='font-normal text-sm'>500 GM</p>
                                    </div>
                                </div>
                                <div className='col-span-2 '>
                                    <button className=' flex gap-2  primaryColor py-2 px-6 rounded-sm text-base font-semibold bg-[#55AE7B1F]'><FaShoppingBasket size={22} />Add</button>
                                </div>
                                <div className='col-span-3 font-bold text-base'> $500</div>
                                <div className='col-span-1  '><RiDeleteBin6Line size={22} className='text-red-400' /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Wishlist