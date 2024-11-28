import React, { useEffect, useState } from 'react'
import Home from '@/components/homepage/Home'
import * as api from "@/api/apiRoutes"
import { setShop } from '@/redux/slices/shopSlice'
import { useSelector, useDispatch } from 'react-redux'
import Categories from '../categories/Categories'
import Loader from '../loader/Loader'
import Layout from '../layout/Layout'

const Homepage = () => {

    const dispatch = useDispatch()
    const shopData = useSelector((state) => state.Shop.shop)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        const fetchData = async () => {
            try {
                const response = await api.getShop({ latitude: 23.022505, longitude: 72.5713621 })
                dispatch(setShop({ data: response.data }))
                setLoading(false)
            } catch (error) {
                console.log("error", error)
                setLoading(false)
            }
        }
        fetchData();
    }, [])


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