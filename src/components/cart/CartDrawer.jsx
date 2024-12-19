import React, { useEffect, useState } from 'react';
import { t } from "@/utils/translation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import CartProductsCard from '../productcards/CartProductsCard';
import { useSelector } from 'react-redux';
import * as api from "@/api/apiRoutes"
import { IoIosCloseCircle } from 'react-icons/io';
import NoCartData from "@/assets/Empty_Cart.svg"
import Image from 'next/image';


const CartDrawer = ({ showCart, setShowCart }) => {
    const city = useSelector(state => state.City.city);
    const user = useSelector(state => state.User)
    const setting = useSelector(state => state.Setting.setting)

    const [cartProducts, setCartProducts] = useState([])
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        setLoading(true)
        try {
            const cartData = await api.getCart({ latitude: city?.latitude, longitude: city?.longitude })
            setCartProducts(cartData?.data?.cart)
            setCartData(cartData?.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }

    return (
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

                {loading ? <p>Loading...</p> : cartProducts?.length !== 0 ? <>
                    <div className='flex flex-col overflow-y-scroll h-3/4 mt-6 p-2'>
                        {cartProducts?.map((product) => {
                            return (
                                <div key={product?.id}>
                                    <CartProductsCard product={product} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-full justify-end  max-w-sm mx-auto p-4 border rounded-md shadow-sm ">
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm ">
                                <span>{t("total")}</span>
                                <span className="font-bold">{setting?.currency}{cartData?.sub_total}</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <button className="w-full py-2 text-white primaryBackColor rounded-md font-medium ">
                                {user?.jwtToken ? t("checkout") : t("login_to_checkout")}

                            </button>
                            <button className="w-full py-2 border rounded-md font-medium  cardBorder">
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
    );
};

export default CartDrawer;
