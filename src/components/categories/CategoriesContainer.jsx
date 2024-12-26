import React from 'react'
import CategoryCard from './CategoryCard'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { t } from "@/utils/translation"
import Link from 'next/link';

const CategoriesContainer = ({ categories }) => {
    return (
        <section>
            <div className='container py-6'>
                <div className="flex justify-between items-center p-0 w-full mb-3">
                    <div className="textColor text-[24px] font-bold !tracking-wide leading-[29px] m-0">
                        <p>{t('shop_by')} {t('categories')}</p>
                    </div>
                    <div className="">
                    </div>
                    <div className="flex items-center ">
                        {/* {categories?.categoriess?.length > 5 ? ( */}
                        <div className="flex justify-end items-center gap-4 flex-col md:flex-row">
                            <Link className="" href="/categories/all">{t('see_all')}</Link>
                            <div className='flex gap-2 '>
                                <button className="category-button-next cardBorder rounded-full text-[#888] opacity-70 !p-2 inline-block text-[15px] relative right-[5%] top-0 transition-all duration-300 ease-linear visibility-visible z-10 "
                                >
                                    <IoMdArrowBack className='textColor' size={20} />
                                </button>
                                <button className=" category-button-prev cardBorder rounded-full text-[#888] opacity-70 !p-2 inline-block text-[15px] relative right-[5%] top-0 transition-all duration-300 ease-linear visibility-visible z-10 ">
                                    <IoMdArrowForward className='textColor' size={20} />
                                </button>
                            </div>

                        </div>
                        {/* ) : null} */}
                    </div>
                </div>

                <div className='flex'>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={5}
                        navigation={{
                            nextEl: ".category-button-prev",
                            prevEl: ".category-button-next",
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 6 },
                        }}
                    >
                        {categories?.categories?.map((category, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <CategoryCard category={category} />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>

                </div>
            </div>
        </section>
    )
}

export default CategoriesContainer;