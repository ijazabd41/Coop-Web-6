import React, { useEffect, useState } from 'react'
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux'
import VerticleProductCard from '../productcards/VerticleProductCard'
import { t } from '@/utils/translation'
import CardSkeleton from '../skeleton/CardSkeleton'


const HomeAllProducts = () => {

    const city = useSelector((state) => state.City.city)
    const setting = useSelector(state => state.Setting.setting)
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalProducts, setTotalProducts] = useState(null)
    const [offset, setOffset] = useState(0)

    const totalProductsPerPage = 12;
    useEffect(() => {
        handleFetchProduct()
    }, [offset, city])

    useEffect(() => {
        setAllProducts([])
        setOffset(0)
    }, [city])

    const handleFetchProduct = async () => {
        setLoading(true)
        const latitude = city?.latitude || setting?.default_city?.latitude
        const longitude = city?.longitude || setting?.default_city?.longitude
        try {
            if (latitude && longitude) {
                const response = await api.getProductByFilter({ latitude: latitude, longitude: longitude, filters: { limit: totalProductsPerPage, offset: offset } });
                if (response.status == 1) {
                    setTotalProducts(response.total)
                    setAllProducts((products) => [...products, ...response.data])
                    setLoading(false)
                } else {
                    return
                }
            }

        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }

    const handleFetchMore = () => {
        setOffset(offset => offset + totalProductsPerPage)
    }

    const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);

    return (
        <section>
            <div className='container'>
                <div className='flex flex-col gap-3 px-2'>
                    <h2 className='textColor text-xl sm:text-3xl font-extrabold  leading-[29px] m-0'>{t("allProducts")}</h2>
                    <div className='grid grid-cols-12 gap-2'>
                        {loading ?
                            placeholderItems.map(index => {
                                return (
                                    <div className='col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2' key={index}>
                                        <CardSkeleton height={300} />
                                    </div>

                                )
                            })
                            :
                            allProducts?.map((product) => {
                                return (
                                    <div key={product?.id} className='col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2'>
                                        <VerticleProductCard product={product} />
                                    </div>
                                )
                            })
                        }
                        <div className='col-span-12 my-3 w-full flex justify-center mx-auto'>
                            {(totalProducts > allProducts?.length) ?
                                <button className='bg-[#29363f] rounded-md text-white text-base font-medium gap-1 p-1.5 px-3' onClick={handleFetchMore}>{t("load_more")}</button>
                                : null
                            }
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HomeAllProducts