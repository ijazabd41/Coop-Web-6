import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { t } from "@/utils/translation"
import { FaMinus, FaPlus, FaRegEye, FaRegHeart, FaShoppingBasket, FaStar } from 'react-icons/fa'
import Link from 'next/link'
import { MdArrowDropDown } from "react-icons/md";
import VariantsModal from '../variantsmodal/VariantsModal'
import ProductDetailModal from '../productdetailmodal/ProductDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { addGuestCartTotal, addtoGuestCart, setCart, setCartProducts, setCartSubTotal, subGuestCartTotal } from '@/redux/slices/cartSlice';
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';

const ListViewProductCard = ({ product }) => {

  const dispatch = useDispatch();

  const cart = useSelector(state => state.Cart)
  const setting = useSelector(state => state.Setting.setting)

  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0])
  const [showVariants, setShowVariants] = useState(false)
  const [showProductDetail, setShowProductDetail] = useState(false)


  useEffect(() => {
    setSelectedVariant(product?.variants?.[0])
  }, [])

  const calculateDiscount = (discountPrice, actualPrice) => {
    const difference = actualPrice - discountPrice;
    const actualDiscountPrice = (difference / actualPrice)
    return actualDiscountPrice * 100;
  }
  const getProductQuantities = (products) => {
    return Object.entries(products?.reduce((quantities, product) => {
      const existingQty = quantities[product.product_id] || 0;
      return { ...quantities, [product.product_id]: existingQty + product.qty };
    }, {})).map(([productId, qty]) => ({
      product_id: parseInt(productId),
      qty
    }));
  }

  // cart functionality
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
  const AddToGuestCart = (product, productId, productVariantId, Qty, isExisting, flag) => {
    const finalPrice = selectedVariant?.discounted_price !== 0 ? selectedVariant?.discounted_price : selectedVariant?.price
    if (isExisting) {
      let updatedProducts;
      if (Qty !== 0) {
        if (flag == "add") {
          dispatch(addGuestCartTotal({ data: finalPrice }));
        } else if (flag == "remove") {
          dispatch(subGuestCartTotal({ data: finalPrice }));
        }
        updatedProducts = cart?.guestCart?.map((product) => {
          if (product?.product_id == productId && product?.product_variant_id == productVariantId) {
            return { ...product, qty: Qty };
          } else {
            // dispatch(addGuestCartTotal({ data: finalPrice }));
            return product;
          }
        });
      } else {
        if (flag == "add") {
          dispatch(addGuestCartTotal({ data: finalPrice }));
        } else if (flag == "remove") {
          dispatch(subGuestCartTotal({ data: finalPrice }));
        }
        updatedProducts = cart?.guestCart?.filter(product =>
          product?.product_id != productId && product?.product_variant_id != productVariantId
        );
      }
      dispatch(addtoGuestCart({ data: updatedProducts }));
    } else {
      if (flag == "add") {
        dispatch(addGuestCartTotal({ data: finalPrice }));
      } else if (flag == "remove") {
        dispatch(subGuestCartTotal({ data: finalPrice }));
      }
      // dispatch(addGuestCartTotal({ data: finalPrice }))
      const productData = { product_id: productId, product_variant_id: productVariantId, qty: Qty, productPrice: finalPrice };
      dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }));
    }
  };
  const handleValidateAddExistingGuestProduct = (productQuantity, product, quantity) => {
    const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty;

    if (Number(product.is_unlimited_stock !== 0)) {

      if (productQty >= Number(product?.total_allowed_quantity)) {
        toast.error('Apologies, maximum product quantity limit reached');
      }
      else {
        AddToGuestCart(product, product?.id, selectedVariant?.id, quantity, 1, "add");
      }
    }
    else {
      if (productQty >= Number(selectedVariant?.stock)) {
        toast.error('Oops, Limited Stock Available');
      }
      else if (productQty >= Number(product?.total_allowed_quantity)) {
        toast.error('Apologies, maximum cart quantity limit reached');
      }
      else {
        AddToGuestCart(product, product?.id, selectedVariant?.id, quantity, 1, "add");
      }
    }
  };
  const handleAddNewProductGuest = (productQuantity, product) => {
    const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty
    if (selectedVariant?.is_unlimited_stock == 0 && selectedVariant?.stock == 0) {
      toast.error(t("out_of_stock_message"));
    }
    else if (Number(productQty || 0) < Number(product.total_allowed_quantity)) {
      AddToGuestCart(product, product.id, selectedVariant?.id, 1, 0, "add");
    } else {
      toast.error(t("out_of_stock_message"));
    }
  };
  const handleValidateAddNewProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty

    if ((productQty || 0) >= Number(product?.total_allowed_quantity)) {

      toast.error('Oops, Limited Stock Available');
    }
    else if (Number(product.is_unlimited_stock)) {
      addToCart(product.id, selectedVariant.id, 1);
    } else {
      if (selectedVariant?.status) {
        addToCart(product.id, selectedVariant?.id, 1);
      } else {

        toast.error('Oops, Limited Stock Available');
      }
    }

  };
  const handleIntialAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.isGuest) {
      const quantity = getProductQuantities(cart?.cartProducts)
      handleAddNewProductGuest(quantity, product)
    } else {
      const quantity = getProductQuantities(cart?.cartProducts)
      handleValidateAddNewProduct(quantity, product)
    }
  }
  const handleValidateAddExistingProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(prdct => prdct?.product_id == product?.id)?.qty
    if (Number(product.is_unlimited_stock)) {
      if (productQty < Number(product?.total_allowed_quantity)) {
        addToCart(product.id, selectedVariant?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty + 1);
      } else {
        toast.error('Apologies, maximum product quantity limit reached!');
      }
    } else {
      if (productQty >= Number(selectedVariant.stock)) {
        toast.error(t("out_of_stock_message"));
      }
      else if (Number(productQty) >= Number(product.total_allowed_quantity)) {
        toast.error('Apologies, maximum product quantity limit reached');
      } else {
        addToCart(product.id, selectedVariant?.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty + 1);
      }
    }
  };
  const handleQuantityIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.isGuest) {
      const productQuantity = getProductQuantities(cart?.guestCart)
      handleValidateAddExistingGuestProduct(
        productQuantity,
        product,
        cart?.guestCart?.find(prdct => prdct?.product_id == product?.id && prdct?.product_variant_id == selectedVariant?.id)?.qty + 1
      )
    } else {
      const quantity = getProductQuantities(cart?.cartProducts)
      handleValidateAddExistingProduct(quantity, product)
    }
  }
  const handleQuantityDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.isGuest) {
      AddToGuestCart(
        product,
        product?.id,
        selectedVariant?.id,
        cart?.guestCart?.find((prdct) => prdct?.product_variant_id == selectedVariant?.id)?.qty - 1,
        1,
        "remove"
      );
    } else {
      if (cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == selectedVariant?.id).qty == 1) {
        removeFromCart(product?.id, selectedVariant?.id)
      } else {
        addToCart(product.id, selectedVariant.id, cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty - 1);
      }
    }
  }
  const handleShowVariantModal = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.variants.length > 1) {
      setShowVariants(true)
    } else {
      return
    }
  }
  const handleShowDetailModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowProductDetail(true)
  }

  const productsVariants = product.variants


  const isProductAlreadyAdded = ((cart?.isGuest === false && cart?.cartProducts?.find((prdct) => prdct?.product_variant_id == selectedVariant?.id)?.qty > 0) ||
    (cart?.isGuest === true && cart?.guestCart?.find((prdct) => prdct?.product_variant_id === selectedVariant?.id)?.qty > 0))

  const addedQuantity = cart.isGuest === false ?
    cart?.cartProducts?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty
    : cart?.guestCart?.find(prdct => prdct?.product_variant_id == selectedVariant?.id)?.qty

  const isProductAvailabel = ((product?.variants?.length <= 1 && product?.variants?.[0]?.is_unlimited_stock == 0 && product?.variants?.[0]?.stock == 0) || (selectedVariant?.stock == 0 && selectedVariant?.is_unlimited_stock == 0) || (product?.variants?.length <= 1 && product?.variants?.[0]?.status == 0))


  return (
    <div >
      <div className='grid grid-cols-12 items-center w-full p-3 group border-2'>
        <div className='col-span-6 md:col-span-3'>
          <div className='relative h-1/2 w-full  object-cover'>
            <Image src={product.image_url} height={0} width={0} alt={product.name} className='   w-3/4 aspect-square ' />
            {selectedVariant?.discounted_price !== 0 ? <span class="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-bold left-0 leading-[16px] px-2 py-1 absolute text-center uppercase top-0">
              {calculateDiscount(selectedVariant?.discounted_price, selectedVariant?.price).toFixed(0)}% {t("off")}
            </span> : null}
            <ul className="absolute right-5 top-5 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
              <li className='buttonBorder rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegHeart size={18} className='fontColor' /></Link></li>
              <li className='buttonBorder  rounded-full h-[30px] w-[30px] flex justify-center items-center bodyBackgroundColor'><Link href={"/"}><FaRegEye size={18} className='fontColor' /></Link></li>
            </ul>
          </div>
        </div>
        <div className='col-span-6 md:col-span-7 px-2'>
          <div className='flex flex-col items-start justify-between h-[100px]'>
            <h3 className="flex text-[#2a3640] text-[16px] font-bold leading-[1.2] mt-3 max-h-[2.4em] overflow-hidden text-ellipsis capitalize w-full group-hover:primaryColor">{product?.name}</h3>
            {product?.average_rating > 0 ?
              <div className="rating">
                <div className="flex">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={15}
                        className={`${star <= product?.average_rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              : null}
            <div className='flex'>
              {selectedVariant?.discounted_price !== 0 ? <>  <p className='text-black text-base font-bold'>₹{product?.variants?.[0]?.discounted_price}</p>
                <p className='text-[#868c93] text-[14px] font-normal leading-[17px] m-1 line-through'>₹{product?.variants?.[0]?.price}</p></> : <p className='text-black text-base font-bold'>₹{product?.variants?.[0]?.price}</p>}

            </div>

          </div>
        </div>
        <div className='col-span-12 md:col-span-2 '>
          <div className='flex  gap-3  w-full md:flex-col   md:mb-0 items-center'>

            <button className='w-full  flex items-center my-[5px] justify-center rounded-[4px] p-[5px] buttonBackground ' onClick={(e) => handleShowVariantModal(e, product)}>{`${product?.variants?.[0]?.measurement} ${product?.variants?.[0]?.stock_unit_name}`}{productsVariants?.length > 1 ? <div><MdArrowDropDown size={22} /></div> : <></>}</button>

            {!isProductAvailabel ? <div className='flex gap-0 md:gap-3  h-[40px] md:h-[38px] w-full flex-col md:flex-row'>

              {isProductAlreadyAdded ?
                <div className=' w-full cardBorder  flex justify-between rounded-sm my-1 '>
                  <button className=' md:p-1 flex items-center justify-center primaryBackColor  text-white font-bold text-sm w-8 md:w-5 p-2 rounded-[2px]' onClick={handleQuantityDecrease}><FaMinus /></button>

                  <input value={addedQuantity} disabled className='w-1/2  text-center' min={"1"} max={selectedVariant?.stock} />

                  <button className=' flex items-center justify-center font-bold text-sm  md:p-1 primaryBackColor text-white w-8 md:w-6 rounded-[2px]' onClick={handleQuantityIncrease}><FaPlus /></button>

                </div>
                : <button className='w-full  flex gap-1 text-base my-[5px] items-center  justify-center rounded-[4px] p-[5px] text-white bg-[#55ae7b26] primaryColor '><FaShoppingBasket size={20} onClick={handleIntialAddToCart} /><span>Add</span></button>}

            </div> : <div className=' w-full flex items-center  justify-center text-center h-[38px]  text-[#db3d26] font-extrabold '>{t("OutOfStock")}</div>}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ListViewProductCard