import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { isRtl } from '@/lib/utils';

const HomePageSlider = ({ slider }) => {
    const language = useSelector(state => state.Language.selectedLanguage)
    const rtl = isRtl()
    return (
        <div className="w-full mx-auto md:h-[700px] backgroundColor ">
            <Swiper
                key={rtl}
                dir={language?.type}
                modules={[Pagination, Autoplay]}
                slidesPerView={1.5}
                centeredSlides={true}
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                className="homePageSwiper relative md:h-[700px]"
            >
                {slider?.sliders?.map((slider, index) => {
                    return (
                        <SwiperSlide className=' ' key={index}>
                            <div className="relative    ">
                                <div className="flex flex-col items-center text-center rounded-xl">
                                    <Image
                                        src={slider.image_url}
                                        alt="Fruit Basket"
                                        priority='false'
                                        className="swiper-image w-full md:h-[700px] p-4"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    )
                })}

            </Swiper>
        </div>
    );
};

export default HomePageSlider;
 