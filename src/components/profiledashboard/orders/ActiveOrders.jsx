import React, { useState, useEffect } from 'react'
import { t } from '@/utils/translation'
import ActiveOrdersCard from './ActiveOrdersCard'
import * as api from "@/api/apiRoutes"
import CardSkeleton from '@/components/skeleton/CardSkeleton'

const ActiveOrders = () => {

    const [loading, setLoading] = useState(false)
    const [activeOrders, setActiveOrders] = useState([])
    const [offset, setOffset] = useState(0)
    const [totalOrders, setTotalOrders] = useState(null)
    useEffect(() => {
        handleFetchActiveOrders();
    }, [offset])

    const ordersPerPage = 10;

    const handleFetchActiveOrders = async () => {
        setLoading(true)
        try {
            const response = await api.getOrders({ limit: ordersPerPage, offset: offset, type: 1 })
            setActiveOrders((ord) => [...ord, ...response.data])
            setTotalOrders(response.total)
            setLoading(false)
        } catch (error) {
            console.log("Error", error)
            setLoading(false)
        }
    }
    const handleFetchMore = async () => {
        setOffset(offSet => offSet + ordersPerPage)
    }



    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("active_orders")}</h2>
            </div>
            <div>
                {loading ?
                    Array?.from({ length: 6 })?.map((_, index) => {
                        return (

                            <CardSkeleton height={200} padding="p-4" key={index} />
                        )
                    })
                    : activeOrders?.map((order) => {
                        return (

                            <ActiveOrdersCard order={order} key={order?.id} />
                        )
                    })}
            </div>

            {totalOrders > activeOrders?.length && <div className='flex justify-center p-4'>
                <button className='bg-[#29363f] py-2 px-4 text-white rounded-sm text-lg font-normal' onClick={handleFetchMore}>{t("load_more")}</button>
            </div>}

        </div>
    )
}

export default ActiveOrders