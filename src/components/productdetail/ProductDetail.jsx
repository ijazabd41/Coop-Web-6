import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { FaLink, FaRegHeart, FaShoppingBasket, FaStar } from 'react-icons/fa';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from "@/utils/translation"
import VegIcon from "@/assets/VegIcon.svg";
import NonVegIcon from "@/assets/NonVegIcon.svg";
import NonCancelable from "@/assets/NotCancelable.svg";
import Cancelable from "@/assets/Cancelable.svg";
import Returnable from "@/assets/Returnable.svg";
import NotReturnable from "@/assets/NotReturnable.svg";
import { WhatsappShareButton, WhatsappIcon, TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share"

const ProductDescription = () => {
    const router = useRouter();
    const { slug } = router.query;

    const city = useSelector(state => state.City.city)
    const setting = useSelector(state => state.Setting)

    const [product, setProduct] = useState([])
    const [selectVariant, setSelectedVariant] = useState([])

    useEffect(() => {
        handleFetchBySlug()
    }, [slug])

    const handleFetchBySlug = async () => {
        try {
            const res = await api.getProductById({ slug: slug, latitude: city.latitude, longitude: city.longitude, id: -1 })

            setProduct(res?.data)
            setSelectedVariant(res?.data?.variants?.[0])
        } catch (error) {
            console.log("error", error)
        }
    }

    const currency = setting?.setting?.currency;

    const handleChangeVariant = (variant) => {
        setSelectedVariant(variant)
    }
    const calculateDiscount = (discountPrice, actualPrice) => {
        const difference = actualPrice - discountPrice;
        const actualDiscountPrice = (difference / actualPrice)
        return actualDiscountPrice * 100;
    }

    return (
        <section>
            <div className='container px-2 md:px-0'>
                <div className='mt-1'>
                    <div className='flex flex-col p-1 md:p-6 justify-center  '>

                        <div className='grid  grid-cols-1 md:grid-cols-12  mx-auto mt-2 gap-4 items-start  '>
                            <div className='col-span-12 md:col-span-4 '>
                                <div className='relative aspect-square h-auto w-full'>
                                    <Image src={product?.image_url} alt={product?.name} height={0} width={0} className='h-full w-full aspect-square rounded-sm' />
                                    {selectVariant?.discounted_price !== 0 ? <span class="bg-[#db3d26] rounded-[4px] text-white text-[14px] font-bold left-2 leading-[16px] px-2 py-1 absolute text-center uppercase top-2">
                                        {calculateDiscount(selectVariant?.discounted_price, selectVariant?.price).toFixed(2)}% {t("off")}
                                    </span> : null}
                                </div>
                                <div className='mt-[10px]'>
                                    <Swiper
                                        spaceBetween={10}
                                        modules={[Navigation]}
                                        className="brand-swiper"
                                        breakpoints={{
                                            1200: {
                                                slidesPerView: 3.5,
                                            },
                                            1024: {
                                                slidesPerView: 3,
                                            },
                                            768: {
                                                slidesPerView: 3,
                                            },
                                            375: {
                                                slidesPerView: 3,
                                            },
                                            0: {
                                                slidesPerView: 2.5,
                                            },
                                        }}
                                    >
                                        {product?.images?.map((image, index) => (
                                            <SwiperSlide key={product.id} >
                                                <div className='h-auto relative w-full aspect-square' key={index}>
                                                    <Image src={image} alt={product.name} height={0} width={0} className='h-full w-full aspect-square rounded-sm' />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                            <div className='col-span-12 md:col-span-8 flex flex-col gap-6'>
                                <div className='pb-6 border-b-2'>
                                    <h2 className='font-bold text-2xl break-all'>{product?.name}</h2>
                                    <div className='flex'>
                                        <div className='flex gap-4'>
                                            {product?.average_rating > 0 ?
                                                <div className='border-r-2 px-2'>
                                                    <div className="flex">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star, index) => (
                                                                <FaStar
                                                                    key={star}
                                                                    size={15}

                                                                    className={`${star <= rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'fill-gray-200 text-gray-200'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                : null}
                                        </div>
                                        {product?.seller_name !== null && <div className='flex text-xs'>
                                            <span>{t("seller")}:<span className='font-bold'>{product?.seller_name}</span></span>
                                        </div>}


                                    </div>
                                </div>
                                <div className='flex items-center gap-1'>
                                    {selectVariant?.discounted_price !== 0 ? <>
                                        <h2 className='font-bold text-3xl primaryColor'>{currency}{selectVariant?.discounted_price}</h2><h3 className='line-through font-bold text-base text-[#141A1F]'>{currency}{selectVariant?.price}</h3>
                                    </> : <> <h2 className='font-bold text-3xl primaryColor'>{currency}{selectVariant?.price}</h2></>}
                                </div>
                                {/* <div dangerouslySetInnerHTML={{ __html: product?.description }}>

                                    </div> */}
                                <div className='flex flex-col'>
                                    <p className='font-normal text-base'>{t("chooseVariant")}</p>
                                    <div className=' flex-col grid grid-cols-12'>
                                        {
                                            product?.variants?.map((variant) => {
                                                const discountPrice = variant?.discounted_price
                                                const price = variant?.price
                                                return (
                                                    <div className={`flex flex-col md:col-span-4 lg:col-span-3 col-span-6 mr-2 my-1 text-center rounded-sm  justify-center items-center cursor-pointer ${selectVariant?.id == variant?.id ? "primaryBorder" : "cardBorder"}`} key={variant.id} onClick={() => handleChangeVariant(variant)}>
                                                        <p className='font-bold text-base'>{`${variant?.measurement} ${variant?.stock_unit_name}`}</p>
                                                        <span className='flex gap-1'><p>{currency}{discountPrice != 0 ? discountPrice : price}</p>{discountPrice != 0 ? <p className='line-through'>{currency}{price}</p> : <></>}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div className='flex gap-4 flex-col lg:flex-row'>
                                    <div className='flex gap-4 items-center'>
                                        <div className='grid grid-cols-6 border-2 rounded-sm p-1 lg:py-[10px] items-center'>
                                            <span className='col-span-1 font-bold text-xl'><FiMinus /></span>
                                            <span className='col-span-4 text-center font-medium text-base '>1</span>
                                            <span className='col-span-1 font-bold text-xl'><FiPlus /></span>
                                        </div>
                                        <div>
                                            <button className='primaryBackColor flex gap-2 text-white py-[6px] px-4 lg:py-3 rounded-sm text-base font-semibold'><FaShoppingBasket size={22} />Add to Cart</button>
                                        </div>
                                    </div>

                                    <div className='flex gap-2 items-center'>
                                        <span className='rounded-full border-2 p-2'>
                                            <FaRegHeart size={18} />
                                        </span>
                                        <span>{t("addToWishlist")}</span>
                                    </div>
                                </div>
                                <div className='buttonBackground rounded-sm p-4 flex flex-col gap-4'>
                                    {product?.indicator ? product?.indicator == 1 ? <div className='flex gap-4 items-center'>
                                        <div className='h-[40px] w-[40px] relative object-cover'>
                                            <Image src={VegIcon} fill alt={product?.name} className='h-full w-full ' />
                                        </div>
                                        <p> {t("vegetarian")}</p>
                                    </div> :
                                        <div className='flex gap-4 items-center'>
                                            <div className='h-[40px] w-[40px] relative object-cover'>
                                                <Image src={NonVegIcon} fill alt={product?.name} className='h-full w-full ' />
                                            </div>
                                            <p> {t("non-vegetarian")}</p>
                                        </div>
                                        : null
                                    }
                                    {product?.cancelable_status == 1 ?
                                        <div className='flex items-center  gap-2'>
                                            <div className='h-[40px] w-[40px] relative object-cover'>

                                                <Image fill src={Cancelable} alt='cancelableIcon' className='h-full w-full' />
                                            </div>
                                            <span className='cancelDetail'>
                                                {t("cancelable")}
                                                {product?.till_status == 1 ?
                                                    <p className='font-semibold text-base'>{t("payment_pending")}</p>
                                                    :
                                                    null
                                                }
                                                {product?.till_status == 2 ?
                                                    <p className='font-semibold text-base'>{t("received")}</p>
                                                    :
                                                    null
                                                }
                                                {product?.till_status == 3 ?
                                                    <p className='font-semibold text-base'>{t("processed")}</p>
                                                    :
                                                    null
                                                }
                                                {product?.till_status == 4 ?
                                                    <p className='font-semibold text-base'>{t("shipped")}</p>
                                                    :
                                                    null
                                                }
                                                {product?.till_status == 5 ?
                                                    <p className='font-semibold text-base'>{t("out_for_delivery")}</p>
                                                    :
                                                    null
                                                }
                                            </span>
                                        </div>
                                        :
                                        <div className='flex items-center gap-2'>
                                            <div className='h-[40px] w-[40px] relative object-cover'>
                                                <Image src={NonCancelable} alt='cancelableIcon' className='h-full w-full' fill />
                                            </div>
                                            <span className='font-semibold text-base'>{t("non-cancelable")}</span>
                                        </div>
                                    }

                                    {product?.return_status == 1 ?
                                        <div className='flex items-center gap-2'>
                                            <div className='h-[40px] w-[40px] relative object-cover'>
                                                <Image fill src={Returnable} alt='returnableIcon' className='h-full w-full' />
                                            </div>
                                            <span className='font-semibold text-base'>{t("returnable")} {product?.return_days} {t("days")}</span>
                                        </div>
                                        :
                                        <div className='flex items-center gap-2'>
                                            <div className='h-[40px] w-[40px] relative object-cover'>
                                                <Image fill src={NotReturnable} alt='nonReturnableIcon' className='h-full w-full' />
                                            </div>
                                            <span className='font-semibold text-base'>{t("non-returnable")}</span>
                                        </div>
                                    }



                                </div>
                                <div className='flex justify-between items-center my-2 md:my-0'>
                                    <span className='text-sm font-normal'>{t("shareProduct")}:</span>
                                    <div className='flex gap-3'>
                                        <WhatsappShareButton url='google.com'>
                                            <WhatsappIcon className='h-10 w-10 rounded-full' />
                                        </WhatsappShareButton>
                                        <TwitterShareButton>
                                            <TwitterIcon className='h-10 w-10 rounded-full' />
                                        </TwitterShareButton>
                                        <FacebookShareButton>
                                            <FacebookIcon className='h-10 w-10 rounded-full' />
                                        </FacebookShareButton>
                                        {/* <InstapaperShareButton>
                                            <InstapaperIcon className='h-10 w-10 rounded-full' />
                                        </InstapaperShareButton> */}
                                        <FaLink className='h-10 w-10 rounded-full bg-gray-400 p-2 ' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </section >
    )
}

export default ProductDescription