import React, { useEffect, useState } from 'react';
import { t } from "@/utils/translation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CartProductsCard from './CartDrawerProductsCard';
import { useSelector } from 'react-redux';
import * as api from "@/api/apiRoutes"
import { IoIosCloseCircle } from 'react-icons/io';
import NoCartData from "@/assets/Empty_Cart.svg"
import Image from 'next/image';
import { setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import Login from '../login/Login';
import { useRouter } from 'next/router';

const CartDrawer = ({ showCart, setShowCart }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const city = useSelector(state => state.City.city);
    const cart = useSelector(state => state.Cart)
    const user = useSelector(state => state.User)
    const setting = useSelector(state => state.Setting.setting)

    const [showLogin, setShowLogin] = useState(false)
    const [cartProductsData, setCartProductsData] = useState([])
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (showCart) {
            if (cart.isGuest == false) {
                fetchCart()
            } else if (cart?.guestCart?.length > 0 && cart?.isGuest == true) {
                fetchGuestCart()
            }
        }
    }, [showCart])



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
        <>
            <Sheet open={showCart} >
                <SheetContent className="p-0 w-full sm:w-[900px] ">
                    <SheetHeader className="px-0 py-3 border-[1px] flex justify-between text-left">
                        <SheetTitle className="text-2xl font-bold flex flex-row items-center p-2 justify-between">
                            <p className='text-2xl font-bold'>{t("shoppingCart")}</p>
                            <div>
                                <IoIosCloseCircle size={32} onClick={() => setShowCart(false)} />
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    {loading ? <p>Loading...</p> : cartProductsData?.length !== 0 ? <>
                        <div className='flex flex-col overflow-y-scroll h-3/4 mt-6 p-2'>
                            {cartProductsData?.length !== 0 && cartProductsData?.map((product) => {
                                return (
                                    <div key={product?.id}>
                                        <CartProductsCard product={product} cartProductsData={cartProductsData} setCartProductsData={setCartProductsData} />
                                    </div>
                                )
                            })}
                        </div>
                        <div className="w-full justify-end  max-w-sm mx-auto p-4 border rounded-md shadow-sm ">
                            <div className="space-y-6">
                                <div className="flex justify-between text-sm ">
                                    <span>{t("total")}</span>
                                    <span className="font-bold">{setting?.currency}{cart.isGuest ? cart?.guestCartTotal : cart?.cartSubTotal}</span>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <button className="w-full py-2 text-white primaryBackColor rounded-md font-medium " onClick={handleCheckoutbtnClick} >
                                    {user?.jwtToken ? t("checkout") : t("login_to_checkout")}

                                </button>
                                <button className="w-full py-2 border rounded-md font-medium  cardBorder" onClick={() => router.push("/cart")}>
                                    {t("view_cart")}
                                </button>
                            </div>
                        </div></> :
                        <div className='flex  items-center h-full justify-center my-auto mx-10 '>
                            <div>
                                <Image src={NoCartData} alt='No Cart Data' height={0} width={0} className='h-full w-full' />
                                <h1 className='font-bold text-[22px]  text-center py-2'>{t("empty_cart_list_message")}</h1>
                                <p className='font-bold text-xs text-center'>{t("empty_cart_list_description")}</p>
                            </div>

                        </div>}

                </SheetContent>
            </Sheet>
            <Login showLogin={showLogin} setShowLogin={setShowLogin} />
        </>
    );
};

export default CartDrawer;
