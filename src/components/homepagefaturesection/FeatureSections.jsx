import React from 'react'
import { useSelector } from 'react-redux'
import HomePageSlider from '@/components/mainslider/MainSlider'
import HorizontalCardContainer from './HorizontalCardContainer';
import VerticleCardContainer from './VerticleCardContainer';
import ProductSwiperWithImage from './ProductSwiperWithImage';
import HorizontalProductSwiper from './HorizontalProductSwiper';
import Categories from '../categories/CategoriesContainer';
import BrandSlider from '../shop-by-brands/BrandSlider';
import CountrySlider from '../shop-by-country/CountrySlider';
import SellerSlider from '../shop-by-seller/SellerSlider';
import PromoStrip from './PromoStrip';

import HomeOfferSection from './HomeOfferSection';
import CoopMembershipBenefits from './CoopMembershipBenefits';

const FeatureSections = () => {

    const shop = useSelector(state => state.Shop.shop)

    return (
        <section>
            <div className='md:mx-0'>
                {/* 1. Main Home Slider */}
                {shop?.sliders?.length > 0 && <HomePageSlider slider={shop} />}
                
                {/* 2. Promo Strip */}
                <PromoStrip />

                {/* 3. Shop By Category */}
                {shop?.categories?.length > 0 && <Categories categories={shop} />}

                {/* 4 to 8. Deal of the Day, Best Sellers, Recommended, Featured, Fresh Pick */}
                {shop?.sections && shop?.sections?.map((section, index) => {
                    let Element = null;
                    if (section?.style_web == "style_1") {
                        Element = <HorizontalProductSwiper section={section} index={index} key={`swiper-${section?.id}`} />
                    } else if (section?.style_web == "style_2") {
                        Element = <VerticleCardContainer section={section} index={index} key={`swiper-${section?.id}`} />
                    } else if (section?.style_web == "style_3") {
                        Element = <HorizontalCardContainer section={section} index={index} key={`swiper-${section?.id}`} />
                    } else if (section?.style_web == "style_4") {
                        Element = <ProductSwiperWithImage section={section} index={index} key={`swiper-${section?.id}`} />
                    }
                    
                    if (!Element) return null;

                    return (
                        <React.Fragment key={section?.id}>
                            {Element}
                            {index === 0 && <CoopMembershipBenefits />}
                        </React.Fragment>
                    );
                })}

                {/* 9. Shop By Brand */}
                {shop?.brands?.length > 0 && <BrandSlider brands={shop} />}

                {/* Note: All Products Grid is handled separately in HomeAllProducts */}
            </div>
        </section>
    )
}

export default FeatureSections