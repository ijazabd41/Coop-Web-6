import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { useSelector } from 'react-redux';




const HomePageSlider = ({ slider }) => {

    const language = useSelector(state => state.Language.selectedLanguage)

    return (
        <div className="w-full mx-auto h-full backgroundColor mb-6">
            <Swiper
                dir={language?.type}
                modules={[Pagination, Autoplay]}
                slidesPerView={1.2} // Show 1.5 slides at a time
                centeredSlides={true} // Center the active slide
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                className="homePageSwiper relative"
            >
                {slider?.sliders?.map((slider, index) => {
                    return (
                        <SwiperSlide className='rounded-lg p-2 md:p-8' key={index}>
                            <div className="relative   rounded-lg shadow-lg ">
                                <div className="flex flex-col items-center text-center rounded-xl">
                                    <Image
                                        src={slider.image_url}
                                        alt="Fruit Basket"
                                        priority='false'
                                        className="rounded-xl w-full h-full"
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
