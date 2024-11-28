import React, { PropsWithChildren, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { setSetting } from "@/redux/slices/settingSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes"
import Loader from "@/components/loader/Loader";

const Layout = ({ children }) => {

    const dispatch = useDispatch();

    const city = useSelector(state => state.City)

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSetting()
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
    return (
        <section>
            {
                loading == true ? <Loader screen='full' /> : <>
                    <Header />
                    {children}
                    <Footer />
                </>
            }

        </section>
    )
}

export default Layout