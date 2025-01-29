import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import VerticleProductCard from '../productcards/VerticleProductCard';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setFilterSection } from '@/redux/slices/productFilterSlice';
import { useRouter } from 'next/router';
import { t } from '@/utils/translation';
import { isRtl } from '@/lib/utils';

const HorizontalProductSwiper = ({ section, index }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const rtl = isRtl()
    const shop = useSelector(state => state.Shop.shop);
    const theme = useSelector(state => state.Theme.theme)
    const language = useSelector(state => state.Language.selectedLanguage)
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
        router.push("/products")
    }

    return (
        <div>
            {
                section?.products?.length > 0 ?
                    <section className='py-6 px-2' style={theme == "light" ? { backgroundColor: section?.background_color_for_light_theme } : { backgroundColor: section?.background_color_for_dark_theme }}>

                        <div className='container' >
                            <div dir={language?.type}>
                                <div className='flex justify-between items-center mb-3 '>
                                    <div className='w-1/2'>
                                        <h2 className='textColor text-xl sm:text-3xl font-extrabold  leading-[29px] m-0'>{section?.title}</h2>
                                        <p className=''>{section?.short_description}</p>
                                    </div>
                                    <div className='flex  gap-0 md:gap-4 items-center flex-col md:flex-row'>
                                        <button onClick={handleViewAll} >{t("see_all")}</button>
                                        <div className={` md:flex hidden gap-2 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`} >
                                            <button className={`textColor fontColorBorder rounded-full  prev-btn-${section?.id} p-2`}><IoMdArrowBack className='textColor' size={20} /></button>
                                            <button className={`textColor fontColorBorder rounded-full  next-btn-${section?.id} p-2`}><IoMdArrowForward className='textColor' size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className='mt-[10px]'>
                                    <Swiper
                                        key={rtl}
                                        spaceBetween={20}
                                        modules={[Navigation]}
                                        className="brand-swiper"
                                        navigation={
                                            {
                                                prevEl: `.prev-btn-${section?.id}`,
                                                nextEl: `.next-btn-${section?.id}`
                                            }
                                        }
                                        breakpoints={{

                                            1200: {
                                                slidesPerView: 5,
                                                spaceBetween: 10
                                            },
                                            1024: {
                                                slidesPerView: 4.5,
                                                spaceBetween: 10
                                            },
                                            768: {
                                                slidesPerView: 3.3,
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
                                            <SwiperSlide key={product.id} >
                                                <VerticleProductCard product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </section>
                    : null
            }
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

export default HorizontalProductSwiper