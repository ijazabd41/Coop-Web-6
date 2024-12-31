import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Seller from './Seller'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const SellerSlider = ({ sellers }) => {
    return (
        <section className=' my-6'>
            <div className='container py-12 '>
                <div className='flex flex-col gap-6 mx-2'>
                    <div className='flex justify-between'>
                        <h2 className='textColor text-[24px] font-extrabold tracking-[2px] leading-[29px] m-0'>Shop by Seller </h2>
                        <div className='flex gap-4 items-center flex-col md:flex-row'>
                            <Link href={"/"} >View all</Link>
                            <div className=' flex gap-2'>
                                <button className='buttonBorder rounded-full p-2 seller-slider-prev'><IoMdArrowBack fill="black" size={20} /></button>
                                <button className='buttonBorder rounded-full p-2 seller-slider-next'><IoMdArrowForward fill="black" size={20} /></button>
                            </div>
                        </div>
                    </div>
                    <div className=''>
                        <Swiper
                            spaceBetween={20}
                            modules={[Navigation]}
                            navigation={{
                                prevEl: ".seller-slider-prev",
                                nextEl: ".seller-slider-next"
                            }}
                            className="brand-swiper"
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 10 },
                                640: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {sellers?.sellers?.map((seller, index) => (
                                <SwiperSlide key={seller.id} >
                                    <Seller seller={seller} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default SellerSlider