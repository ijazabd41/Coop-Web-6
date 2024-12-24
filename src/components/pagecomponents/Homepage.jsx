import React, { useEffect, useState } from 'react'
import Home from '@/components/homepage/Home'
import * as api from "@/api/apiRoutes"
import { setShop } from '@/redux/slices/shopSlice'
import { useSelector, useDispatch } from 'react-redux'
import Categories from '../categories/Categories'
import Loader from '../loader/Loader'
import Layout from '../layout/Layout'
import { setSetting } from '@/redux/slices/settingSlice'


const Homepage = () => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting.setting)
    const city = useSelector(state => state.City.city)

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (city) {
            fetchShop()
        }
    }, [city])

    const fetchShop = async () => {
        setLoading(true)
        try {
            const latitude = parseFloat(city?.latitude)
            const longitude = parseFloat(city?.longitude)
            const response = await api.getShop({ latitude: latitude, longitude: longitude })
            dispatch(setShop({ data: response.data }))
            setLoading(false)
        } catch (error) {
            console.log("error", error)
            setLoading(false)
        }
    }



    return (
        <div>
            {
                <Layout>
                    <Home />
                </Layout>
            }


        </div>
    )
}


export default Homepage