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

const HorizontalProductSwiper = ({ section, index }) => {
    const shop = useSelector(state => state.Shop.shop);
    const [promotionImage, setPromotionImage] = useState(null)
    useEffect(() => {
        const promotionImageBelowSection = shop?.offers?.filter((offer) => offer?.position == "below_section");
        const image = promotionImageBelowSection?.filter((offer) => {
            return offer?.section?.title == section?.title
        })
        setPromotionImage(image)
    }, [section])

    return (
        <div>
            {
                section?.products?.length > 0 ?
                    <section className='py-6'>

                        <div className='container'>
                            <div>
                                <div className='flex justify-between pb-3'>
                                    <div>
                                        <h2 className='textColor text-[24px] font-extrabold tracking-[2px] leading-[29px] m-0'>{section?.title}</h2>
                                        <p>{section?.short_description}</p>
                                    </div>
                                    <div className='flex  gap-0 md:gap-4 items-center flex-col md:flex-row'>
                                        <Link href={"/"} >View all</Link>
                                        <div className=' flex gap-2'>
                                            <button className={`buttonBorder rounded-full p-2 prev-btn-${section?.id}`}><IoMdArrowBack fill="black" size={20} /></button>
                                            <button className={`buttonBorder rounded-full p-2 next-btn-${section?.id}`}><IoMdArrowForward fill="black" size={20} /></button>
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
                        <div className='relative'>
                            <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                        </div>
                    )
                })}
            </div>
        </div>


    )
}

export default HorizontalProductSwiper