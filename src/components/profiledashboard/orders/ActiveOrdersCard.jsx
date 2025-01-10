import React from 'react'
import { t } from "@/utils/translation"
import Image from 'next/image'
import DemoImage from "/public/demo.png"
import { IoIosArrowRoundForward } from 'react-icons/io'
import { formatCustomDate } from '@/lib/utils'
import { useSelector } from 'react-redux'
import Link from 'next/link'


const ActiveOrdersCard = ({ order }) => {

    const setting = useSelector(state => state.Setting)

    const getOrderStatus = () => {
        switch (order?.active_status) {
            case "1":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#e3aa0e] rounded-sm text-base font-bold text-[#e3aa0e]'>Payment Pending</span>
                break;
            case "2":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#319795] rounded-sm text-base font-bold text-[#319795]'>Received</span>
                break;
            case "3":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#805AD5] rounded-sm text-base font-bold text-[#805AD5]'>Processed</span>
                break;
            case "4":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#3182CE] rounded-sm text-base font-bold text-[#3182CE]'>Shipped</span>
                break;
            case "5":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#2D3748] rounded-sm text-base font-bold text-[#2D3748]'>Out For Delivery</span>
                break;
            case "6":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#2D3748] rounded-sm text-base font-bold text-[#2D3748]'>Delivered</span>
                break;
            case "7":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#db3232] rounded-sm text-base font-bold text-[#db3232]'>Cancelled</span>
                break;
            case "8":
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#458ae6] rounded-sm text-base font-bold text-[#458ae6]'>Returned</span>
                break;
            default:
                return <span className='p-2 text-center w-10/12 border-[1px] border-[#458ae6] rounded-sm text-base font-bold text-[#458ae6]'>Returned</span>
                break;
        }

    }

    const orderFirstItem = order?.items[0]


    return (
        <div className='w-full   '>

            <div className='py-3 px-4'>
                <div className='w-full cardBorder rounded-md'>
                    <div className='grid grid-cols-12 p-4 border-b-2'>
                        <div className='col-span-1  '>
                            <p className='font-normal text-sm'>{t("order")}</p>
                            <p className='font-bold text-sm'>{order?.id}</p>
                        </div>
                        <div className='col-span-8'>
                            <p className='font-normal text-sm'>{t("orderDate")}</p>
                            <p className='font-bold text-sm'>{formatCustomDate(order?.date)}</p>
                        </div>
                        <div className='col-span-3 flex flex-col  items-end'>
                            <p className='font-normal text-sm'>{t("orderStatus")}</p>
                            {getOrderStatus()}
                        </div>
                    </div>
                    <div className='p-4'>
                        <div className='flex justify-between mb-4'>
                            <div className='flex items-start gap-2'>
                                <div className='h-[64px] w-[64px] relative aspect-square '>
                                    {orderFirstItem?.image_url && <Image src={orderFirstItem?.image_url} alt='demo image' fill className='h-full w-full rounded-sm' />}
                                </div>
                                <div>
                                    <p className='font-bold text-base'>{orderFirstItem?.name}</p>
                                    <p className='text-sm font-normal'>{orderFirstItem?.variant_name}</p>
                                </div>
                            </div>
                            <div className='flex flex-col mr-16'>
                                <p className='text-base font-bold'>{setting?.setting?.currency}{orderFirstItem?.discounted_price != 0 ? orderFirstItem?.discounted_price : orderFirstItem?.price}</p>
                                {orderFirstItem?.discounted_price !== 0 && <p className='text-base font-normal line-through'>{setting?.setting?.currency}{orderFirstItem?.price}</p>}
                            </div>

                        </div>
                        {order?.items?.length > 1 && <button className='rounded-full py-2 px-3 bg-[#12141814] font-medium text-base'>+{order?.items?.length - 1} {t("moteItems")}</button>}
                    </div>
                    <div className=' buttonBackground'>
                        <div className='flex justify-between p-4'>
                            <div className='flex flex-col '>
                                <span>{t("total")} {t("amount")}</span>
                                <span className='font-bold text-lg'>{setting?.setting?.currency}{order?.final_total}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Link href={`/order-detail/${order?.id}`} className='py-2 px-3 hover:primaryBackColor hover:text-white rounded-sm'>{t("view_details")}</Link>
                                <button className='py-2 px-3 primaryBackColor text-white rounded-sm flex  items-center gap-1 text-base font-medium'>{t("track_order")} <IoIosArrowRoundForward size={20} className='p-0 m-0' /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveOrdersCard