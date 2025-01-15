import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Country from './Country';
import { t } from '@/utils/translation';

const CountrySlider = ({ countries }) => {
    return (
        <section>
            <div className='container py-6 px-2'>
                <div className='flex flex-col gap-3'>
                    <div className='flex justify-between items-center'>
                        <h2 className='textColor text-xl sm:text-3xl font-extrabold tracking-[2px] leading-[29px] m-0'>{t("shop_by")} {t("countries")} </h2>
                        <div className='flex gap-4 items-center flex-col md:flex-row text-nowrap'>
                            <Link href={"/"} >{t("see_all")}</Link>
                            <div className='hidden md:flex gap-2'>
                                <button className='cardBorder rounded-full p-2 country-prev'><IoMdArrowBack className='textColor' size={20} /></button>
                                <button className='cardBorder rounded-full p-2 country-next'><IoMdArrowForward className='textColor' size={20} /></button>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <Swiper
                            spaceBetween={20}
                            modules={[Navigation]}
                            className="brand-swiper"
                            navigation={{
                                prevEl: ".country-prev",
                                nextEl: ".country-next"
                            }}
                            breakpoints={{
                                0: { slidesPerView: 1.7, spaceBetween: 10 },
                                320: { slidesPerView: 2.2, spaceBetween: 10 },
                                375: { slidesPerView: 2.5, spaceBetween: 12 },
                                640: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 6, spaceBetween: 20 },
                            }}
                        >
                            {countries?.countries?.map((country, index) => (
                                <SwiperSlide key={country.id} >
                                    <Country country={country} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CountrySlider