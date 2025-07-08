// HomePageSlider.jsx

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay"; // Import the autoplay plugin

import { isRtl } from "@/lib/utils";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";

// You can create a separate CSS file for this or use a <style jsx> block
// if you prefer. This is the "bring-your-own-styles" part of Embla.
// For this example, we'll use Tailwind classes directly.

const HomePageSlider = ({ slider }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);

  const slides = slider?.sliders || [];
  const slideCount = slides.length;

  // --- Embla Carousel Setup ---

  // 1. Initialize the Autoplay plugin
  const autoplayPlugin = Autoplay({
    delay: 2500,
    stopOnInteraction: false,
    stopOnMouseEnter: true, // Good UX practice
  });

  // 2. Setup the main Embla hook
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      // Embla Options
      loop: slideCount > 1, // Looping is more stable in Embla
      align: "center", // This is the equivalent of Swiper's `centeredSlides`
      containScroll: "trimSnaps",
      direction: language?.type === "rtl" ? "rtl" : "ltr",
    },
    [autoplayPlugin] // Pass the plugins in an array
  );

  // 3. State for custom pagination dots
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  // --- Event Handlers for Embla ---

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // 4. Set up the state and event listeners when the carousel is ready
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect); // Update on resize, etc.
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // --- Click Handler for slides ---
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
              className="relative flex-shrink-0 min-w-0"
              style={{
                flexBasis: slideCount > 1 ? "66.6666%" : "100%",
                // paddingLeft: "1rem",
              }}
              key={index}
            >
              <div
                className="flex flex-col items-center text-center rounded-xl p-2 md:p-4"
                onClick={() => handleSliderClick(slide)}
              >
                <Image
                  src={slide.image_url}
                  alt="Fruit Basket"
                  priority="false"
                  className="swiper-image w-full max-h-[900px] h-[200px] sm:h-[250px] md:h-[380px] lg:h-[570px] 2xl:h-[650px]"
                  width={0}
                  height={0}
                  onClick={() => handleSliderClick(slide)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Pagination Dots */}
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
