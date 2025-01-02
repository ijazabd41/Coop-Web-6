import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';




const HomePageSlider = ({ slider }) => {
    return (
        <div className="w-full mx-auto h-full backgroundColor mb-6">
            <Swiper
                modules={[Pagination, Autoplay]}
                // spaceBetween={20} // Space between slides
                slidesPerView={1.2} // Show 1.5 slides at a time
                centeredSlides={true} // Center the active slide
                pagination={{ clickable: true }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                className="homePageSwiper relative "
            // loop={true}
            >
                {slider?.sliders?.map((slider, index) => {
                    return (
                        <SwiperSlide className='rounded-lg p-2 md:p-8' key={index}>
                            <div className="relative   rounded-lg shadow-lg ">
                                <div className="flex flex-col items-center text-center rounded-xl">
                                    <img
                                        src={slider.image_url}
                                        alt="Fruit Basket"
                                        className="rounded-xl"
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
