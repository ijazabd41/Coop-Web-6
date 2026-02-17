import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import CategoryCard from "./CategoryCard";
import { t } from "@/utils/translation";

import "swiper/css";
import "swiper/css/navigation";

const SubCategorySwiper = ({
  title,
  subCategories,
  isLoading,
  languageType,
  rtl,
  onCategoryClick,
}) => {
  if (!subCategories.length) return null;

  return (
    <>
      
      {title && (
        <div className="textColor text-xl sm:text-3xl font-extrabold !tracking-wide leading-[29px] m-0">
          <p>{title}</p>
        </div>
      )}

      <div className="container" dir={languageType}>
        
        <div className="flex justify-between items-center p-0 w-full">
          <div className="md:flex hidden gap-2">
            <button className="group category-button-next swiperBorderColor rounded-full !p-2 inline-block hover:primaryBackColor hover:text-white hover:primaryBorder">
              <IoMdArrowBack
                size={20}
                className="swiperNavButtonColor group-hover:text-white"
              />
            </button>
            <button className="group category-button-prev swiperBorderColor rounded-full !p-2 inline-block hover:primaryBackColor hover:text-white hover:primaryBorder">
              <IoMdArrowForward
                size={20}
                className="swiperNavButtonColor group-hover:text-white"
              />
            </button>
          </div>
        </div>

        
        <div className="mt-6">
          <Swiper
            key={rtl}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.5}
            navigation={{
              nextEl: ".category-button-prev",
              prevEl: ".category-button-next",
            }}
            breakpoints={{
              0: { slidesPerView: 2 },
              320: { slidesPerView: 2.5 },
              375: { slidesPerView: 2.3 },
              425: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {isLoading ? (
              <SwiperSlide>
                <div className="p-4 text-sm opacity-60">
                  {t("loading")}
                </div>
              </SwiperSlide>
            ) : (
              subCategories.map((category) => (
                <SwiperSlide
                  key={category.id}
                  onClick={() => onCategoryClick(category)}
                >
                  <CategoryCard category={category} />
                </SwiperSlide>
              ))
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default SubCategorySwiper;