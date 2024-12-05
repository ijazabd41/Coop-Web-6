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

    const dispatch = useDispatch()
    const shopData = useSelector((state) => state.Shop.shop)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchSetting()
        fetchData();
    }, [])

    const fetchSetting = async () => {
        setLoading(true)
        try {
            const res = await api.getSetting()
            dispatch(setSetting({ data: res.data }))
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }
    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await api.getShop({ latitude: 23.022505, longitude: 72.5713621 })
            dispatch(setShop({ data: response.data }))
            setLoading(false)
        } catch (error) {
            console.log("error", error)
            setLoading(false)
        }
    }


    return (
        <div>
            {loading == true ? <Loader screen='full' /> :
                <Layout>
                    <Home shopData={shopData} />
                </Layout>
            }


        </div>
    )
}


export default Homepage