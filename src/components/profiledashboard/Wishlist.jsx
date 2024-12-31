import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import * as api from "@/api/apiRoutes"
import { useDispatch, useSelector } from 'react-redux'
import WishlistCard from '../productcards/WishlistCard'

const Wishlist = () => {
    const city = useSelector(state => state.City.city)
    const [wishlistProducts, setWishlistProducts] = useState([])


    useEffect(() => {
        handleFetchLikedProducts();
    }, [])

    const handleFetchLikedProducts = async () => {
        try {
            const response = await api.getFavorite({ latitude: city?.latitude, longitude: city.longitude })
            if (response.status == 1) {
                setWishlistProducts(response.data)
            } else {
                console.log(response.message)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (

        <div className='w-full cardBorder rounded-sm '>
            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("wishlist")}</h2>
            </div>
            <div>
                {wishlistProducts && wishlistProducts?.map((prdct) => {
                    return (
                        <div key={prdct?.id}>
                            <WishlistCard product={prdct} setWishlistProducts={setWishlistProducts} />
                        </div>
                    )
                })}

            </div>

        </div>


    )
}

export default Wishlist