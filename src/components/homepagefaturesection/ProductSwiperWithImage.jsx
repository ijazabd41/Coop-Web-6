import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Demo from "/public/demo.png"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import VerticleProductCard from '../productcards/VerticleProductCard';
import { useSelector } from 'react-redux'
import { t } from '@/utils/translation'
import { useDispatch } from 'react-redux'
import { setFilterSection } from '@/redux/slices/productFilterSlice'
import { useRouter } from 'next/navigation'

const ProductSwiperWithImage = ({ section }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const theme = useSelector(state => state.Theme.theme)
    const shop = useSelector(state => state.Shop.shop);
    const [promotionImage, setPromotionImage] = useState(null)
    useEffect(() => {
        const promotionImageBelowSection = shop?.offers?.filter((offer) => offer?.position == "below_section");
        const image = promotionImageBelowSection?.filter((offer) => {
            return offer?.section?.title == section?.title
        })
        setPromotionImage(image)
    }, [section])


    const handleViewAll = () => {
        dispatch(setFilterSection({ data: section?.id }))
        router.push('/products')
    }

    return (
        <div>
            {section?.products?.length > 0 ? <section className='py-6' style={theme == "light" ? { backgroundColor: section?.background_color_for_light_theme } : { backgroundColor: section?.background_color_for_dark_theme }}>
                <div className='container px-2 '>
                    <div>
                        <div className='flex justify-between items-center mb-3'>
                            <div>
                                <h2 className='textColor text-2xl sm:text-3xl font-extrabold tracking-[2px] leading-[29px] m-0'>{section?.title} </h2>
                                <p>{section?.short_description}</p>
                            </div>
                            <div className='flex  gap-0 md:gap-4 items-center flex-col md:flex-row'>
                                <button onClick={handleViewAll}>{t("see_all")}</button>
                                <div className=' md:flex gap-2 hidden'>
                                    <button className={`cardBorder rounded-full p-2 prev-btn-${section?.id}`}><IoMdArrowBack className='textColor' size={20} /></button>
                                    <button className={`cardBorder rounded-full p-2 next-btn-${section?.id}`}><IoMdArrowForward className='textColor' size={20} /></button>
                                </div>
                            </div>
                        </div>
                        <div className='grid grid-cols-1  md:grid-cols-12 gap-4'>
                            {/* Image Section */}
                            <div className='md:col-span-3'>
                                <div className='aspect-square w-full h-full relative'>
                                    <Image src={section?.banner_web_url} height={0} width={0} alt='Logo' className='object-cover h-full w-full' />
                                </div>
                            </div>

                            {/* Swiper Section */}
                            <div className='md:col-span-9'>
                                <Swiper
                                    spaceBetween={20}
                                    modules={[Navigation]}
                                    navigation={
                                        {
                                            prevEl: `.prev-btn-${section?.id}`,
                                            nextEl: `.next-btn-${section?.id}`
                                        }
                                    }
                                    className="brand-swiper"
                                    breakpoints={{
                                        1200: {
                                            slidesPerView: 3.7,
                                            spaceBetween: 10
                                        },
                                        1024: {
                                            slidesPerView: 3.55,
                                            spaceBetween: 10
                                        },
                                        768: {
                                            slidesPerView: 2.3,
                                            spaceBetween: 10
                                        },
                                        500: {
                                            slidesPerView: 2,
                                            spaceBetween: 10
                                        },
                                        300: {
                                            slidesPerView: 1.5,
                                            spaceBetween: 10
                                        },
                                    }}
                                >
                                    {section?.products?.map((product, index) => (
                                        <SwiperSlide key={product.id}>
                                            <VerticleProductCard product={product} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>

                    </div>
                </div>
            </section> : null}
            <div className='container mb-6'>
                {promotionImage && promotionImage?.map((offer) => {
                    return (
                        <div className='relative' key={offer?.id}>
                            <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                        </div>
                    )
                })}
            </div>
        </div>


    )
}

export default ProductSwiperWithImage