import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import BrandCard from './BrandCard'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from "@/utils/translation"
import { useDispatch, useSelector } from 'react-redux';
import { setFilterBrands } from '@/redux/slices/productFilterSlice';
import { useRouter } from 'next/router';
import { isRtl } from '@/lib/utils';
const BrandSlider = ({ brands }) => {
    const rtl = isRtl();
    const dispatch = useDispatch()
    const router = useRouter()
    const language = useSelector(state => state.Language.selectedLanguage)
    const handleBrandClick = (brand) => {
        dispatch(setFilterBrands({ data: [brand?.id] }))
        router.push(`/products`)
    }

    return (
        <section>
            <div className='container py-3 md:py-6 px-2' dir={language?.type}>
                <div className='flex justify-between items-center mb-3'>
                    <h2 className='textColor text-xl sm:text-3xl font-extrabold tracking-[2px] leading-[29px] m-0'>{t("shop_by")} {t("brands")}</h2>
                    <div className={`flex items-center gap-2 `}>
                        <Link href={"/brands"} >{t("see_all")}</Link>
                        <div className={` md:flex hidden gap-2 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}>
                            <button className='fontColorBorder rounded-full p-2 seller-prev'><IoMdArrowBack className='textColor' size={20} /></button>
                            <button className='fontColorBorder rounded-full p-2 seller-next'><IoMdArrowForward className='textColor' size={20} /></button>
                        </div>
                    </div>
                </div>
                <div >
                    <Swiper
                        key={rtl}
                        slidesPerView={1.5}
                        spaceBetween={20}
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".seller-prev",
                            nextEl: ".seller-next"
                        }}
                        className="brand-swiper"
                        breakpoints={{
                            0: { slidesPerView: 1.5 },
                            320: { slidesPerView: 2.2 },
                            375: { slidesPerView: 2.3 },
                            425: { slidesPerView: 2.5 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 6 },
                        }}
                    >
                        {brands?.brands?.map((brand, index) => (
                            <SwiperSlide key={index} onClick={() => handleBrandClick(brand)}>
                                <BrandCard brand={brand} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default BrandSlider