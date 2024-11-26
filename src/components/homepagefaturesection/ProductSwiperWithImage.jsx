import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Demo from "/public/demo.png"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import VerticleProductCard from '../productcards/VerticleProductCard';

const ProductSwiperWithImage = ({ products }) => {
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
                    <div className='grid grid-cols-1  md:grid-cols-12 gap-4'>
                        {/* Image Section */}
                        <div className='md:col-span-3'>
                            <div className='aspect-square w-full h-full relative'>
                                <Image src={Demo} alt='Logo' className='object-cover h-full w-full' />
                            </div>
                        </div>

                        {/* Swiper Section */}
                        <div className='md:col-span-9'>
                            <Swiper
                                spaceBetween={20}
                                modules={[Navigation]}
                                navigation={
                                    {
                                        prevEl: ".prev-btn",
                                        nextEl: ".next-btn"
                                    }
                                }
                                className="brand-swiper"
                                breakpoints={{
                                    1200: {
                                        slidesPerView: 4,
                                        spaceBetween: 10
                                    },
                                    1024: {
                                        slidesPerView: 3.55,
                                        spaceBetween: 10
                                    },
                                    768: {
                                        slidesPerView: 3,
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
                                    <SwiperSlide key={product.id}>
                                        <VerticleProductCard product={product} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ProductSwiperWithImage