import React, { useState } from 'react'
import Image from 'next/image'
import { FaMinus, FaPlus, FaShoppingBasket } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import * as api from "@/api/apiRoutes"
import { useDispatch, useSelector } from 'react-redux'
import { IoMdArrowDropdown } from 'react-icons/io'
import VariantsModal from '../variantsmodal/VariantsModal'
import { setCart, setCartProducts, setCartSubTotal } from '@/redux/slices/cartSlice';
import { toast } from 'react-toastify'
import { t } from "@/utils/translation"

const WishlistCard = ({ product, setWishlistProducts }) => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.Setting.setting)
    const cart = useSelector(state => state.Cart)

    const [showVariants, setShowVariants] = useState(false)

    const getProductQuantities = (products) => {
        return Object.entries(products?.reduce((quantities, product) => {
            const existingQty = quantities[product.product_id] || 0;
            return { ...quantities, [product.product_id]: existingQty + product.qty };
        }, {})).map(([productId, qty]) => ({
            product_id: parseInt(productId),
            qty
        }));
    }
    const handleRemoveFromWishlist = async (prdctId) => {
        try {
            const response = await api.removeFromFavorite({ product_id: prdctId })
            if (response.status == 1) {
                const updateProducts = wishlistProducts?.filter((prdct) => prdct?.id != prdctId)
                setWishlistProducts(updateProducts)
            } else {
                console.log(response.message)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleShowVariatModal = () => {
        if (product?.variants?.length > 0) {
            setShowVariants(true)
        } else {
            return;
        }
    }

    const handleQuantityIncrease = (e) => {
        const quantity = getProductQuantities(cart?.cartProducts)
        handleValidateAddExistingProduct(quantity, product)
    }
    const handleQuantityDecrease = (e) => {
        if (cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == product?.variants[0]?.id).qty == 1) {
            removeFromCart(product?.id, product?.variants[0]?.id)
        } else {
            addToCart(product.id, product?.variants[0].id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty - 1);
        }
    }

    const removeFromCart = async (productId, variantId) => {
        try {
            const response = await api.removeFromCart({ product_id: productId, product_variant_id: variantId })
            if (response?.status === 1) {
                const updatedProducts = cart?.cartProducts?.filter(product => ((product?.product_id != productId) && (product?.product_variant_id != variantId)));
                dispatch(setCartSubTotal({ data: response?.sub_total }));
                dispatch(setCartProducts({ data: updatedProducts }));
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    const handleValidateAddExistingProduct = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty
        if (Number(product.is_unlimited_stock)) {
            if (productQty < Number(product?.total_allowed_quantity)) {
                addToCart(product.id, product?.variants[0]?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty + 1);
            } else {
                toast.error('Apologies, maximum product quantity limit reached!');
            }
        } else {
            if (productQty >= Number(product?.variants[0].stock)) {
                toast.error(t("out_of_stock_message"));
            }
            else if (Number(productQty) >= Number(product.total_allowed_quantity)) {
                toast.error('Apologies, maximum product quantity limit reached');
            } else {
                addToCart(product.id, product?.variants[0]?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty + 1);
            }
        }
    };

    const addToCart = async (productId, productVId, qty) => {
        try {
            const response = await api.addToCart({ product_id: productId, product_variant_id: productVId, qty: qty })
            if (response.status === 1) {
                if (cart?.cartProducts?.find((product) => ((product?.product_id == productId) && (product?.product_variant_id == productVId)))?.qty == undefined) {
                    dispatch(setCart({ data: response }));
                    const updatedCartCount = [...cart?.cartProducts, { product_id: productId, product_variant_id: productVId, qty: qty }];
                    dispatch(setCartProducts({ data: updatedCartCount }));
                    dispatch(setCartSubTotal({ data: response?.sub_total }));
                }
                else {
                    const updatedProducts = cart?.cartProducts?.map(product => {
                        if (((product.product_id == productId) && (product?.product_variant_id == productVId))) {
                            return { ...product, qty: qty };
                        } else {
                            return product;
                        }
                    });
                    dispatch(setCart({ data: response }));
                    dispatch(setCartProducts({ data: updatedProducts }));
                    dispatch(setCartSubTotal({ data: response?.sub_total }));
                }
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleValidateAddNewProduct = (productQuantity, product) => {
        const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty

        if ((productQty || 0) >= Number(product?.total_allowed_quantity)) {

            toast.error('Oops, Limited Stock Available');
        }
        else if (Number(product.is_unlimited_stock)) {
            addToCart(product.id, product?.variants[0].id, 1);
        } else {
            if (product?.variants[0]?.status) {
                addToCart(product.id, product?.variants[0]?.id, 1);
            } else {

                toast.error('Oops, Limited Stock Available');
            }
        }

    };

    const handleIntialAddToCart = (e) => {
        const quantity = getProductQuantities(cart?.cartProducts)
        handleValidateAddNewProduct(quantity, product)

    }

    const isProductAlreadyAdded = ((cart?.isGuest === false && cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == product?.variants[0]?.id)?.qty > 0))
    const addedQuantity = cart?.cartProducts?.find(prdct => prdct?.product_variant_id == product?.variants[0]?.id)?.qty


    return (
        <div className='cardBorder'>
            {/* <div className='p-4'>
            <div className='p-4 relative'>
                <div className='grid grid-flow-row md:grid-cols-12 gap-4'>
                    <div className='row-span-1 md:col-span-4 flex gap-2'>
                        <div className='h-16 w-16'>
                            <Image src={product?.image_url} alt='Image' height={64} width={64} className='object-cover h-full w-full rounded-sm' />
                        </div>
                        <div>
                            <h2 className='font-bold text-base truncate'>{product?.name}</h2>
                            <p className='font-normal text-sm flex gap-1 items-center cursor-pointer' onClick={handleShowVariatModal}>
                                {product?.variants[0]?.measurement}
                                {product?.variants[0]?.stock_unit_name}
                                {product?.variants?.length > 1 && <IoMdArrowDropdown />}
                            </p>
                        </div>
                    </div>

                    <div className='row-span-1 md:col-span-6'>
                        <div className='flex flex-col-reverse justify-end gap-3 md:flex-row items-center'>
                            {isProductAlreadyAdded ? (
                                <div className='h-1/2 max-w-[130px] md:w-2/5 cardBorder flex justify-between rounded-sm my-1'>
                                    <button className='md:p-1 flex items-center justify-center primaryBackColor text-white font-bold text-sm w-8 rounded-[2px] h-9' onClick={handleQuantityDecrease}>
                                        <FaMinus />
                                    </button>
                                    <input value={addedQuantity} disabled className='w-full text-center' min="1" max={product?.variants[0]?.stock} />
                                    <button className='flex items-center justify-center font-bold text-sm md:p-1 primaryBackColor text-white w-8 rounded-[2px] h-9' onClick={handleQuantityIncrease}>
                                        <FaPlus />
                                    </button>
                                </div>
                            ) : (
                                <button className='h-9 max-w-[130px] flex gap-2 justify-center items-center primaryColor py-2 px-6 rounded-sm text-base font-semibold bg-[#55AE7B1F]' onClick={handleIntialAddToCart}>
                                    <FaShoppingBasket size={22} />
                                    {t("add")}
                                </button>
                            )}

                            <div className='flex flex-col font-bold text-base min-w-[120px]'>
                                {product?.variants[0]?.discounted_price !== 0 ? (
                                    <>
                                        <p className='textColor text-base font-bold'>{setting?.currency}{product?.variants[0]?.discounted_price}</p>
                                        <p className='textColor text-[14px] font-normal leading-[17px] m-1 line-through'>{setting?.currency}{product?.variants[0]?.price}</p>
                                    </>
                                ) : (
                                    <p className='textColor text-base font-bold'>{setting?.currency}{product?.variants[0]?.price}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='absolute right-3 top-3 md:right-5 md:top-5' onClick={() => handleRemoveFromWishlist(product?.id)}>
                    <RiDeleteBin6Line size={22} className='text-red-400' />
                </div>
            </div>
        </div> */}
            <div className="p-4">
                <div className="p-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex justify-between max-w-[200px]">
                            <div className="flex gap-2">
                                <div className='h-16 w-16'>
                                    <Image src={product?.image_url} alt='Image' height={64} width={64} className='object-cover h-full w-full rounded-sm' />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="font-bold text-lg">{product?.name}</h2>
                                    <p className="font-normal text-sm flex gap-1 items-center cursor-pointer" onClick={handleShowVariatModal}>
                                        {product?.variants[0]?.measurement}
                                        {product?.variants[0]?.stock_unit_name}
                                        {product?.variants?.length > 1 && <IoMdArrowDropdown />}
                                    </p>
                                </div>

                            </div>
                            <div className='block md:hidden' onClick={() => handleRemoveFromWishlist(product?.id)}>
                                <RiDeleteBin6Line size={22} className='text-red-400' />
                            </div>
                        </div>
                        {/* TODO: Make UI Fixed */}
                        <div className="flex flex-col-reverse md:flex-row justify-end gap-2 max-w-[150px]">
                            {isProductAlreadyAdded ? (
                                <div className='cardBorder flex w-ful h-full justify-between rounded-sm my-1'>
                                    <button className='md:p-1 flex items-center justify-center primaryBackColor text-white font-bold text-sm w-8 rounded-[2px]' onClick={handleQuantityDecrease}>
                                        <FaMinus />
                                    </button>
                                    <input value={addedQuantity} disabled className='w-full h-full text-center' min="1" max={product?.variants[0]?.stock} />
                                    <button className='flex items-center justify-center font-bold text-sm md:p-1 primaryBackColor text-white w-8 rounded-[2px]' onClick={handleQuantityIncrease}>
                                        <FaPlus />
                                    </button>
                                </div>
                            ) : (
                                <button className='flex gap-2 w-full h-full justify-center items-center primaryColor py-2 px-6 rounded-sm text-base font-semibold bg-[#55AE7B1F]' onClick={handleIntialAddToCart}>
                                    <FaShoppingBasket size={22} />
                                    {t("add")}
                                </button>
                            )}
                            <div className='flex flex-col w-full font-bold text-base'>
                                {product?.variants[0]?.discounted_price !== 0 ? (
                                    <>
                                        <p className='textColor text-base font-bold'>{setting?.currency}{product?.variants[0]?.discounted_price}</p>
                                        <p className='textColor text-[14px] font-normal leading-[17px] m-1 line-through'>{setting?.currency}{product?.variants[0]?.price}</p>
                                    </>
                                ) : (
                                    <p className='textColor text-base font-bold'>{setting?.currency}{product?.variants[0]?.price}</p>
                                )}
                            </div>
                        </div>
                        <div className='hidden md:block' onClick={() => handleRemoveFromWishlist(product?.id)}>
                            <RiDeleteBin6Line size={22} className='text-red-400' />
                        </div>
                    </div>
                </div>
            </div>
            {/* Variants Modal */}
            <VariantsModal product={product} showVariants={showVariants} setShowVariants={setShowVariants} />
        </div>
    )
}

export default WishlistCard