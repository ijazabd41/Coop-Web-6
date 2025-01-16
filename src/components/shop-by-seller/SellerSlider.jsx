import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Seller from './Seller'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from '@/utils/translation';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setFilterBySeller } from '@/redux/slices/productFilterSlice';

const SellerSlider = ({ sellers }) => {
    const router  = useRouter()
    const dispatch = useDispatch()

    const handleSellerClick = (seller) => {
        dispatch(setFilterBySeller({ data: seller?.id }));
        router.push("/products")
    }
    return (
        <section className=' my-6'>
            <div className='container py-12 px-2'>
                <div className='flex flex-col gap-3 '>
                    <div className='flex justify-between items-center'>
                        <h2 className='textColor text-xl sm:text-3xl font-extrabold tracking-[2px] leading-[29px] m-0'>{t("shop_by")} {t("sellers")} </h2>
                        <div className='flex gap-4 items-center flex-col md:flex-row'>
                            <Link href={"/sellers"} >{t("see_all")}</Link>
                            <div className='hidden md:flex gap-2'>
                                <button className='cardBorder textColor rounded-full p-2 seller-slider-prev'><IoMdArrowBack className='textColor' size={20} /></button>
                                <button className='cardBorder textColor rounded-full p-2 seller-slider-next'><IoMdArrowForward className='textColor' size={20} /></button>
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
                                0: { slidesPerView: 1.7, spaceBetween: 10 },
                                320: { slidesPerView: 2.2, spaceBetween: 10 },
                                375: { slidesPerView: 2.5, spaceBetween: 12 },
                                640: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {sellers?.sellers?.map((seller, index) => (
                                <SwiperSlide key={seller.id} onClick={()=> handleSellerClick(seller)} >
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