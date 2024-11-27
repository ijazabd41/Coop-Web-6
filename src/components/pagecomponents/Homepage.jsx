import React, { useEffect } from 'react'
import Home from '@/components/homepage/Home'
import * as api from "@/api/apiRoutes"
import { setShop } from '@/redux/slices/shopSlice'
import { useSelector, useDispatch } from 'react-redux'
import Categories from '../categories/Categories'

const Homepage = () => {

    const dispatch = useDispatch()
    const shopData = useSelector((state) => state.Shop.shop)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.getShop({ latitude: 23.022505, longitude: 72.5713621 })
                dispatch(setShop({ data: response.data }))
            } catch (error) {
                console.log("error", error)
            }
        }
        fetchData();
    }, [])


    return (
        <div>
            <Home shopData={shopData} />

        </div>
    )
}


export default Homepage