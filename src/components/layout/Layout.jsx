import React, { PropsWithChildren, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { setPaymentSetting, setSetting } from "@/redux/slices/settingSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes"
import { ToastContainer } from 'react-toastify';
import { setShop } from '@/redux/slices/shopSlice';



const Layout = ({ children }) => {

    const dispatch = useDispatch();
    const theme = useSelector(state => state.Theme.theme)
    const setting = useSelector(state => state.Setting)
    const city = useSelector(state => state.City)
    const shopData = useSelector((state) => state.Shop.shop)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchSetting()
        fetchShop();
        fetchPaymentSetting()
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

    const fetchPaymentSetting = async () => {
        setLoading(true);
        try {
            const res = await api.getPaymentSetting();
            dispatch(setPaymentSetting({ data: JSON.parse(atob(res.data)) }))
        } catch (error) {
            setLoading(false);
            console.log("error", error)
        }
    }

    const fetchShop = async () => {
        setLoading(true)
        try {
            const latitude = parseFloat(city?.city?.latitude)
            const longitude = parseFloat(city?.city?.longitude)
            const response = await api.getShop({ latitude: latitude, longitude: longitude })
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
                    <ToastContainer theme={theme} key="toastContainer" bodyClassName={"toast-body"} toastClassName='toast-container-class' />
                </>
            }
        </section>
    )
}

export default Layout