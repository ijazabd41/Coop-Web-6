// HomePageSlider.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import { imageUrl } from "@/api/odoo/utils";

const HomePageSlider = ({ slider }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);

  const slides = slider?.sliders || [];
  const slideCount = slides.length;

  const autoplayPlugin = Autoplay({
    delay: 2000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: slideCount > 1,
      align: "center",
      containScroll: "trimSnaps",
      direction: language?.type === "RTL" ? "rtl" : "ltr",
    },
    [autoplayPlugin],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleSliderClick = (slide) => {
    if (slide?.type === "slider_url") {
      window.open(slide?.slider_url, "_blank");
    } else if (slide?.type === "product") {
      router.push(`/product/${slide.type_slug}`);
    } else if (slide?.type === "category") {
      if (slide?.category_data?.has_child === true) {
        router.push(`/categories/${slide?.type_slug}`);
      } else {
        dispatch(setFilterCategory({ data: slide?.type_id.toString() }));
        router.push(`/products`);
      }
    }
  };

  if (slideCount === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto backgroundColor relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              className="relative flex-shrink-0 min-w-0 basis-full w-full"
              key={index}
            >
              <div
                className="flex flex-col items-center text-center w-full cursor-pointer"
                onClick={() => handleSliderClick(slide)}
              >
                <img
                  src={imageUrl(slide.image_url)}
                  alt={slide.title || slide.name || "Banner"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="swiper-image w-full h-auto max-h-[900px] object-contain"
                  onClick={() => handleSliderClick(slide)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-[45px] left-1/2 -translate-x-1/2 
             md:flex items-center justify-center gap-2 
             md:px-[6px] md:py-1 lg:px-[10px] lg:py-2 bg-white rounded-[4px] 
             w-fit mx-auto z-10 hidden"
      >
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-300 
        ${
          index === selectedIndex
            ? "bg-[var(--primary-color)] w-[22px]"
            : "bg-gray-400 w-3"
        }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePageSlider;
