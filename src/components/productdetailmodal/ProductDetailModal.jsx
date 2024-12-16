import React, { useEffect, useState } from 'react'
import * as api from "@/api/apiRoutes"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { FaRegHeart, FaShoppingBasket, FaStar, FaLink } from 'react-icons/fa'
import Image from 'next/image'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useSelector } from 'react-redux'
import { t } from "@/utils/translation"
import { FiMinus, FiPlus } from 'react-icons/fi'
import { MdArrowDropDown } from 'react-icons/md'
import VegIcon from "@/assets/VegIcon.svg";
import NonVegIcon from "@/assets/NonVegIcon.svg";
import NonCancelable from "@/assets/NotCancelable.svg";
import Cancelable from "@/assets/Cancelable.svg";
import Returnable from "@/assets/Returnable.svg";
import NotReturnable from "@/assets/NotReturnable.svg";
import { WhatsappShareButton, WhatsappIcon, TwitterIcon, TwitterShareButton, FacebookIcon, FacebookShareButton } from "react-share"


const ProductDetailModal = ({ product, showDetailModal, setShowDetailModal }) => {

    const setting = useSelector(state => state.Setting)
    const [productDetails, setProductDetails] = useState([])
    useEffect(() => {

        if (showDetailModal) {
            const fetchProductById = async () => {
                try {
                    const res = await api.getProductById({
                        latitude: 23.022505,
                        longitude: 72.5713621,
                        id: product.id,
                        slug: product.slug
                    })
                    setProductDetails(res.data)
                } catch (error) {
                    console.log("error", error)
                }
            }
            fetchProductById()
        }
    }, [showDetailModal, product.id, product.slug])

    const currency = setting?.setting?.currency



    return (
        <>
            <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
                <DialogContent className="max-w-4xl lg:max-w-screen-lg overflow-y-scroll max-h-screen">
                    <div className='mt-12 '>
                        <div className='flex flex-col p-1 md:p-6 justify-center md:justify-start mx-auto'>
                            <div className='pb-6 border-b-2'>
                                <h2 className='font-bold text-2xl break-all'>{productDetails?.name}</h2>
                                <div className='flex'>
                                    <div className='flex gap-4'>
                                        {productDetails?.average_rating > 0 ?
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
                                    <div className='flex text-xs'>
                                        <span>Seller:<span className='font-bold'>Sellername</span></span>
                                    </div>

                                </div>
                            </div>
                            <div className='grid  grid-cols-1 md:grid-cols-12  mx-auto mt-6 gap-3  justify-center'>
                                <div className='md:col-span-4 col-span-12'>
                                    <div className='relative aspect-square h-auto w-full'>
                                        <Image src={productDetails?.image_url} alt={productDetails.name} fill className='h-full w-full aspect-square rounded-sm' />
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
                                            {productDetails?.images?.map((image, index) => (
                                                <SwiperSlide key={productDetails.id} >
                                                    <div className='h-auto relative w-full aspect-square' key={index}>
                                                        <Image src={image} alt={productDetails.name} fill className='h-full w-full aspect-square rounded-sm' />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                                <div className=' col-span-12 md:col-span-8 flex flex-col gap-6'>
                                    <div className='flex items-center gap-1'><h2 className='font-bold text-3xl primaryColor'>{currency}60.00</h2><h3 className='line-through font-bold text-base text-[#141A1F]'>{currency}85.00</h3></div>
                                    {/* <div dangerouslySetInnerHTML={{ __html: productDetails?.description }}>

                                    </div> */}
                                    <div className='flex flex-col'>
                                        <p className='font-normal text-base'>{t("chooseVariant")}</p>
                                        <div className=' flex-col grid grid-cols-12'>
                                            {
                                                productDetails?.variants?.map((variant) => {
                                                    const discountPrice = variant?.discounted_price
                                                    const price = variant?.price
                                                    return (
                                                        <div className='flex flex-col col-span-6 md:col-span-4 mr-2 my-1 text-center rounded-sm  border-2 justify-center items-center' key={variant.id}>
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
                                                <button className='primaryBackColor flex gap-2 text-white py-[6px] px-2 lg:py-3 rounded-sm text-base font-semibold'><FaShoppingBasket size={22} />Add to Cart</button>
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
                                        {productDetails?.indicator ? productDetails?.indicator == 1 ? <div className='flex gap-4 items-center'>
                                            <div className='h-[40px] w-[40px] relative object-cover'>
                                                <Image src={VegIcon} fill alt={productDetails?.name} className='h-full w-full ' />
                                            </div>
                                            <p> {t("vegetarian")}</p>
                                        </div> :
                                            <div className='flex gap-4 items-center'>
                                                <div className='h-[40px] w-[40px] relative object-cover'>
                                                    <Image src={NonVegIcon} fill alt={productDetails?.name} className='h-full w-full ' />
                                                </div>
                                                <p> {t("non-vegetarian")}</p>
                                            </div>
                                            : null
                                        }
                                        {productDetails?.cancelable_status == 1 ?
                                            <div className='flex items-center  gap-2'>
                                                <div className='h-[40px] w-[40px] relative object-cover'>

                                                    <Image fill src={Cancelable} alt='cancelableIcon' className='h-full w-full' />
                                                </div>
                                                <span className='cancelDetail'>
                                                    {t("cancelable")}
                                                    {productDetails?.till_status == 1 ?
                                                        <p className='font-semibold text-base'>{t("payment_pending")}</p>
                                                        :
                                                        null
                                                    }
                                                    {productDetails?.till_status == 2 ?
                                                        <p className='font-semibold text-base'>{t("received")}</p>
                                                        :
                                                        null
                                                    }
                                                    {productDetails?.till_status == 3 ?
                                                        <p className='font-semibold text-base'>{t("processed")}</p>
                                                        :
                                                        null
                                                    }
                                                    {productDetails?.till_status == 4 ?
                                                        <p className='font-semibold text-base'>{t("shipped")}</p>
                                                        :
                                                        null
                                                    }
                                                    {productDetails?.till_status == 5 ?
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

                                        {productDetails?.return_status == 1 ?
                                            <div className='flex items-center gap-2'>
                                                <div className='h-[40px] w-[40px] relative object-cover'>
                                                    <Image fill src={Returnable} alt='returnableIcon' className='h-full w-full' />
                                                </div>
                                                <span className='font-semibold text-base'>{t("returnable")} {productDetails?.return_days} {t("days")}</span>
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
                                    <div className='flex justify-between items-center my-2 md:my-0 '>

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
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ProductDetailModal