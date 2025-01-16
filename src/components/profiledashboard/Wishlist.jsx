import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import * as api from "@/api/apiRoutes"
import { useDispatch, useSelector } from 'react-redux'
import WishlistCard from '../productcards/WishlistCard'
import CardSkeleton from '../skeleton/CardSkeleton'

const Wishlist = () => {
    const city = useSelector(state => state.City.city)
    const [wishlistProducts, setWishlistProducts] = useState([])
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(null)


    const itemPerPage = 10;

    useEffect(() => {
        handleFetchLikedProducts();
    }, [offset])

    const handleFetchLikedProducts = async () => {
        setLoading(true)
        try {
            const response = await api.getFavorite({ latitude: city?.latitude, longitude: city.longitude, limit: itemPerPage, offset: offset })
            if (response.status == 1) {
                setWishlistProducts(state => [...state, ...response.data])
                setLoading(false)
                setTotal(response.total)
            } else {
                setLoading(false)
                console.log(response.message)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }


    const handleLoadMore = () => {
        setOffset(offset => offset + itemPerPage);
    }

    return (

        <div className='w-full cardBorder rounded-sm '>
            <div className='backgroundColor flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("wishlist")}</h2>
            </div>
            <div>
                {loading ?
                    Array?.from({ length: 6 })?.map((_, index) => {
                        return (
                            <CardSkeleton height={200} padding="3px" key={index} />
                        )
                    })
                    : wishlistProducts && wishlistProducts?.map((prdct) => {
                        return (
                            <div key={prdct?.id}>
                                <WishlistCard product={prdct} setWishlistProducts={setWishlistProducts} />
                            </div>
                        )
                    })}

                {total > wishlistProducts?.length &&
                    <div className='flex justify-center my-2'>
                        <button onClick={handleLoadMore} className='bg-[#29363f] py-2 px-4 text-white rounded-sm text-lg font-normal'>{t("load_more")}</button>
                    </div>
                }
            </div>

        </div>


    )
}

export default Wishlist