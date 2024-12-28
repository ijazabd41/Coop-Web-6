import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import DemoImage from "/public/demo.png"
import Image from 'next/image'
import { FaShoppingBasket } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import * as api from "@/api/apiRoutes"
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowDropdown } from 'react-icons/io'
import VariantsModal from '../variantsmodal/VariantsModal'
import WishlistCard from '../productcards/WishlistCard'

const Wishlist = () => {
    const dispatch = useDispatch();

    const city = useSelector(state => state.City.city)
    const setting = useSelector(state => state.Setting.setting)

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