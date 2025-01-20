import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import PrevOrderCard from './PrevOrderCard'
import * as api from "@/api/apiRoutes"
import Loader from '@/components/loader/Loader'
import CardSkeleton from '@/components/skeleton/CardSkeleton'
import OrderNotFoundImage from "@/assets/not_found_images/No_Orders.svg"
import Image from 'next/image'

const PrevOrder = () => {

    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [prevOrders, setPrevOrders] = useState([])
    const [totalOrders, setTotalOrders] = useState(null)
    useEffect(() => {
        handleFetchPrevOrders()
    }, [offset])

    const ordersPerPage = 10;

    const handleFetchPrevOrders = async () => {
        setLoading(true)
        try {
            const response = await api.getOrders({ limit: ordersPerPage, offset: offset, type: 0 })
            if (response?.status == 1) {
                setPrevOrders((ord) => [...ord, ...response?.data])
                setTotalOrders(response.total)
                setLoading(false)
            } else {
                setLoading(false)
                setPrevOrders([])
                console.log("Error", response)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }

    const handleFetchMore = async () => {
        setOffset(offSet => offSet + ordersPerPage)
    }


    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='backgroundColor flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("order_history")}</h2>
            </div>
            <div>
                {loading ? Array.from({ length: 6 })?.map((_, index) => {
                    return (
                        <CardSkeleton height={200} padding="p-4" key={index} />
                    )
                }) : prevOrders?.length == 0 ? <div className='h-full w-full flex items-center justify-center flex-col gap-2 p-3'>
                    <Image src={OrderNotFoundImage} alt='Order Not found' height={0} width={0} className='h-1/2 w-1/2' />
                    <h2 className='text-2xl font-bold'>{t("no_order")}</h2>
                </div> : prevOrders?.map((order) => {
                    return (
                        <PrevOrderCard order={order} key={order?.id} />
                    )
                })}
            </div>
            {totalOrders > prevOrders?.length && <div className='flex justify-center p-4'>
                <button className='bg-[#29363f] py-2 px-4 text-white rounded-sm text-lg font-normal' onClick={handleFetchMore}>{t("load_more")}</button>
            </div>}
        </div>
    )
}

export default PrevOrder