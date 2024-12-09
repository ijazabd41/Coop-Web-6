import React, { PropsWithChildren, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { setSetting } from "@/redux/slices/settingSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes"
import Loader from "@/components/loader/Loader";
import { setShop } from '@/redux/slices/shopSlice';

const Layout = ({ children }) => {

    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting)
    const city = useSelector(state => state.City)
    const shopData = useSelector((state) => state.Shop.shop)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchSetting()
        fetchShop();
    }, [city])

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
    const fetchShop = async () => {
        setLoading(true)
        try {
            const latitude = parseFloat(setting.setting.default_city?.latitude)
            const longitude = parseFloat(setting.setting.default_city?.longitude)
            const response = await api.getShop({ latitude: latitude, longitude: longitude })
            console.log("res", response)
            dispatch(setShop({ data: response.data }))
            setLoading(false)
        } catch (error) {
            console.log("error", error)
            setLoading(false)
        }
    }


    return (
        <section>
            {
                <>
                    <Header />
                    {children}
                    <Footer />
                </>
            }

        </section>
    )
}

export default Layout