import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Country from './Country';

const CountrySlider = ({ countries }) => {
    return (
        <section>
            <div className='container py-6'>
                <div className='flex flex-col gap-6'>
                    <div className='flex justify-between'>
                        <h2 className='textColor text-[24px] font-extrabold tracking-[2px] leading-[29px] m-0'>Shop by Country </h2>
                        <div className='flex gap-4 items-center flex-col md:flex-row'>
                            <Link href={"/"} >View all</Link>
                            <div className=' flex gap-2'>
                                <button className='buttonBorder rounded-full p-2 country-prev'><IoMdArrowBack className='textColor' size={20} /></button>
                                <button className='buttonBorder rounded-full p-2 country-next'><IoMdArrowForward className='textColor' size={20} /></button>
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
                                320: { slidesPerView: 2, spaceBetween: 10 },
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