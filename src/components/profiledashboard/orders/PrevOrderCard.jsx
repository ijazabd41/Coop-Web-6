import React from 'react'
import { t } from "@/utils/translation"
import Image from 'next/image'
import DemoImage from "/public/demo.png"
import { IoIosArrowRoundForward } from 'react-icons/io'
import { formatCustomDate } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

const PrevOrderCard = ({ order }) => {

    const setting = useSelector((state) => state.Setting)
    const deliveryDate = order?.status?.find((ord) => ord[0] == "6")
    const orderFirstItem = order?.items[0]


    return (
        <div className='w-full   '>
            <div className='py-3 px-4'>
                <div className='w-full  cardBorder rounded-md'>
                    <div className='grid grid-cols-12 p-4 border-b-2'>
                        <div className='col-span-1  '>
                            <p className='font-normal text-sm'>{t("order")}</p>
                            <p className='font-bold text-sm'>{order?.id}</p>
                        </div>
                        <div className='col-span-6'>
                            <p className='font-normal text-sm'>{t("orderDate")}</p>
                            <p className='font-bold text-sm'>{formatCustomDate(order?.date)}</p>
                        </div>
                        <div className='col-span-5 flex flex-col  items-end'>
                            <p className='font-normal text-sm'>{t("orderStatus")}</p>
                            <span className='font-bold text-base'>{t("order_delivered_on")}{formatCustomDate(deliveryDate?.[1])}</span>
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='flex justify-between mb-4'>
                            <div className='flex items-center gap-2'>
                                <div className='h-[64px] w-[64px] relative aspect-square '>
                                    {/* condition rendering for prevent TypeError: Cannot read properties of null (reading 'default') error */}
                                    {orderFirstItem?.image_url && <Image src={orderFirstItem?.image_url} alt='demo image' fill className='h-full w-full rounded-sm' />}
                                </div>
                                <div>
                                    <p className='font-bold text-base'>{orderFirstItem?.product_name}</p>
                                    <p className='text-sm font-normal'>{orderFirstItem?.variant_name}</p>
                                </div>
                            </div>
                            <div className='flex flex-col mr-16'>
                                <p className='text-base font-bold'>{setting?.setting?.currency}{orderFirstItem?.discounted_price != 0 ? orderFirstItem?.discounted_price : orderFirstItem?.price}</p>
                                {orderFirstItem?.discounted_price !== 0 && <p className='text-base font-normal line-through'>{setting?.setting?.currency}{orderFirstItem?.price}</p>}

                            </div>
                        </div>
                        {order?.items?.length > 1 && <button className='rounded-full py-2 px-3 bg-[#12141814] font-medium text-base'>{order?.items?.length - 1} {t("moteItems")}</button>}

                    </div>
                    <div className='backgroundColor'>
                        <div className='flex justify-between p-4'>
                            <div className='flex flex-col'>
                                <span>{`${t("total")} ${t("amount")}`} </span>
                                <span className='font-bold text-lg'>{setting?.setting?.currency}{order?.final_total}</span>
                            </div>
                            <div className='flex items-center'>
                                <Link href={`/order-detail/${order?.id}`} className=' flex items-center gap-2 py-2 px-3  cardBorder rounded-sm font-medium text-base hover:primaryBackColor hover:text-white'>{t("view_details")} <FaArrowRight /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PrevOrderCard