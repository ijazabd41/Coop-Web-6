import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import PrevOrderCard from './PrevOrderCard'
import * as api from "@/api/apiRoutes"
import Loader from '@/components/loader/Loader'

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
        try {
            const response = await api.getOrders({ limit: ordersPerPage, offset: offset, type: 0 })
            if (response?.status == 1) {
                setPrevOrders((ord) => [...ord, ...response?.data])
                setTotalOrders(response.total)
            } else {
                console.log("Error", response)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleFetchMore = async () => {
        setOffset(offSet => offSet + ordersPerPage)
    }


    return (
        <div className='w-full cardBorder rounded-sm '>
            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("order_history")}</h2>
            </div>
            <div>
                {prevOrders?.map((order) => {
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