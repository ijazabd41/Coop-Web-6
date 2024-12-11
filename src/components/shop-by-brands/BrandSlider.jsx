import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Brand from './Brand'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
const BrandSlider = ({ brands }) => {
    return (
        <section>
            <div className='container py-6'>
                <div className='flex justify-between'>
                    <h2 className='textColor text-[24px] font-extrabold tracking-[2px] leading-[29px] m-0'>Shop by brands </h2>
                    <div className='flex gap-4 items-center flex-col md:flex-row'>
                        <Link href={"/products"} >View all</Link>
                        <div className=' flex gap-2'>
                            <button className='buttonBorder rounded-full p-2 seller-prev'><IoMdArrowBack className='textColor' size={20} /></button>
                            <button className='buttonBorder rounded-full p-2 seller-next'><IoMdArrowForward className='textColor' size={20} /></button>
                        </div>
                    </div>
                </div>
                <div className='pt-6'>
                    <Swiper
                        slidesPerView={5}
                        spaceBetween={20}
                        modules={[Navigation]}
                        navigation={{
                            prevEl: ".seller-prev",
                            nextEl: ".seller-next"
                        }}
                        className="brand-swiper"
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 10 },
                            640: { slidesPerView: 3, spaceBetween: 15 },
                            1024: { slidesPerView: 6, spaceBetween: 20 },
                        }}
                    >
                        {brands?.brands?.map((brand, index) => (
                            <SwiperSlide key={index}>
                                <Brand brand={brand} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    )
}

export default BrandSlider