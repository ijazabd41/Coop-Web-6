import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import VerticleProductCard from '../productcards/VerticleProductCard';

const HorizontalProductSwiper = ({ products }) => {

    return (
        <section className='py-6'>
            <div className='container'>
                <div>
                    <div className='flex justify-between pb-3'>
                        <div>
                            <h2 className='textColor text-[24px] font-extrabold tracking-[2px] leading-[29px] m-0'>Products </h2>
                            <p>Test desc</p>
                        </div>
                        <div className='flex  gap-0 md:gap-4 items-center flex-col md:flex-row'>
                            <Link href={"/"} >View all</Link>
                            <div className=' flex gap-2'>
                                <button className='buttonBorder rounded-full p-2 prev-btn'><IoMdArrowBack fill="black" size={20} /></button>
                                <button className='buttonBorder rounded-full p-2 next-btn'><IoMdArrowForward fill="black" size={20} /></button>
                            </div>
                        </div>
                    </div>
                    <div className='mt-[10px]'>
                        <Swiper
                            spaceBetween={20}
                            modules={[Navigation]}
                            className="brand-swiper"
                            navigation={
                                {
                                    prevEl: ".prev--btn",
                                    nextEl: ".next-btn"
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
                                    slidesPerView: 3.5,
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
                            {products?.sections?.[1]?.products?.map((product, index) => (
                                <SwiperSlide key={product.id} >
                                    <VerticleProductCard product={product} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HorizontalProductSwiper