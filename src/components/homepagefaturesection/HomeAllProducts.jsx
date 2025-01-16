import React, { useEffect, useState } from 'react'
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux'


const HomeAllProducts = () => {

    const city = useSelector((state) => state.Shop.shop)
    const [allProducts, setAllProducts] = useState([])

    useEffect(() => {

    }, [])

    const handleFetchProduct = async () => {
        try {
            const response = await api.get
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <section>
            <div className='container'>
                <div className='flex flex-col gap-3'>
                    <h2 className='font-bold text-xl'>{t("allProducts")}</h2>
                    <div className='grid grid-cols-12'>
                        <div>
                            { }
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HomeAllProducts