import React from 'react'
import { t } from "@/utils/translation"
import Image from 'next/image'
import DemoImage from "/public/demo.png"
import { IoIosArrowRoundForward } from 'react-icons/io'
const ActiveOrders = () => {
    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("active_orders")}</h2>

            </div>
            <div className='p-4'>
                <div className='w-full cardBorder rounded-sm'>
                    <div className='grid grid-cols-12 p-4 border-b-2'>
                        <div className='col-span-1  '>
                            <p className='font-normal text-sm'>order</p>
                            <p className='font-bold text-sm'>#5331</p>
                        </div>
                        <div className='col-span-9'>
                            <p className='font-normal text-sm'>Order Date</p>
                            <p className='font-bold text-sm'>2024-11-30, 11:43:09 AM</p>
                        </div>
                        <div className='col-span-2 flex flex-col  items-center'>
                            <p className='font-normal text-sm'>Order Status</p>
                            <span className='bg-[#F1FFFC] p-2 text-center w-10/12 border-[1px] border-[#319795] rounded-sm text-base font-bold text-[#319795]'>Received</span>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='flex justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                <div className='h-[64px] w-[64px] relative aspect-square '>
                                    <Image src={DemoImage} alt='demo image' fill className='h-full w-full rounded-sm' />
                                </div>
                                <div>
                                    <p className='font-bold text-base'>Farm Fresh Blueberries</p>
                                    <p className='text-sm font-normal'>500 GM</p>
                                </div>
                            </div>
                            <div className='flex flex-col mr-20'>
                                <p className='text-base font-bold'>$230</p>
                                <p className='text-base font-normal line-through'>$300.00</p>
                            </div>
                        </div>
                    </div>
                    <div className=' buttonBackground'>
                        <div className='flex justify-between p-4'>
                            <div className='flex flex-col'>
                                <span>Total Amount</span>
                                <span className='font-bold text-lg'>$1,550.00</span>
                            </div>
                            <div className='flex items-center'>
                                <button className='py-2 px-3 '>View Order Details</button>
                                <button className='py-2 px-3 primaryBackColor text-white rounded-sm flex  items-center gap-1 text-base font-medium'>Track Order <IoIosArrowRoundForward size={20} className='p-0 m-0' /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveOrders