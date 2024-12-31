import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import CartProductCard from './CartProductCard'
import CartCouponCard from './CartCouponCard'
import { t } from '@/utils/translation'
import { useSelector, useDispatch } from 'react-redux'
import { setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice'
import * as api from "@/api/apiRoutes"

const Cart = () => {
    const dispatch = useDispatch();
    const city = useSelector(state => state.City.city);
    const cart = useSelector(state => state.Cart)
    const user = useSelector(state => state.User)


    const [cartProductsData, setCartProductsData] = useState([])
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (cart.isGuest == false) {
            fetchCart()
        } else if (cart?.guestCart?.length > 0 && cart?.isGuest == true) {
            fetchGuestCart()
        }
    }, [])



    const fetchCart = async () => {
        setLoading(true)
        try {
            const cartData = await api.getCart({ latitude: city?.latitude, longitude: city?.longitude })
            if (cartData?.status == 1) {
                setCartProductsData(cartData?.data?.cart)
                dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
                setCartData(cartData?.data)
                setLoading(false)
            } else {
                dispatch(setCartProducts({ data: [] }));
                dispatch(setCartSubTotal({ data: 0 }));
                setCartProductsData([])
                // setCartData([])
                setCartSubTotal(0)
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }

    const fetchGuestCart = async () => {
        try {
            const variantIds = cart?.guestCart?.map((p) => p.product_variant_id);
            const quantities = cart?.guestCart?.map((p) => p.qty);
            const response = await api.getGuestCart({ latitude: city?.latitude, longitude: city?.longitude, variant_ids: variantIds?.join(","), quantities: quantities?.join(",") })
            if (response.status == 1) {
                setCartProductsData(response.data.cart);
                dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
            }
        } catch (error) {
            console.log("Error", error)
        }
    }



    const handleCheckoutbtnClick = () => {
        if (cart.isGuest) {
            setShowCart(false)
            setShowLogin(true)
        } else {
            router.push("checkout")
        }
    }


    return (
        <section>
            <BreadCrumb />
            <div className="container">
                <div className="my-12">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold text-2xl">{t("myCart")}</h1>
                        <p className="font-medium text-base">{`${t("there_are")} ${cartProductsData?.length}  ${t("product_in_your_cart")}`}</p>
                    </div>
                    <div className="grid grid-cols-12 gap-4 mt-6 ">
                        <div className="col-span-9 cardBorder rounded-sm">
                            <div className="grid grid-cols-12 gap-4 p-4  font-medium border-b cardBorder">
                                <div className="col-span-4">{t("product")}</div>
                                <div className="col-span-2 text-center">{t("price")}</div>
                                <div className="col-span-2 text-center">{t("quantity")}</div>
                                <div className="col-span-2 text-center">{t("total")}</div>
                                <div className="col-span-1 text-center">{t("action")}</div>
                            </div>

                            {cartProductsData?.map((product) => (
                                <CartProductCard key={product?.id} product={product} cartProductsData={cartProductsData} setCartProductsData={setCartProductsData} />
                            ))}
                        </div>

                        <div className="col-span-3">
                            <CartCouponCard />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}

export default Cart