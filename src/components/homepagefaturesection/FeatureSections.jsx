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
                
                {/* Membership Benefits immediately after hero slider */}
                <CoopMembershipBenefits />
                
                {/* 2. Promo Strip */}
                <PromoStrip />

                {/* 3. Shop By Category */}
                {shop?.categories?.length > 0 && <Categories categories={shop} />}

                {/* 4 to 8. Deal of the Day, Best Sellers, Recommended, Featured, Fresh Pick */}
                {shop?.sections && shop?.sections?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} key={section?.id} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} key={section?.id} />)
                    }
                    return null;
                })}

                {/* 9. Shop By Brand */}
                {shop?.brands?.length > 0 && <BrandSlider brands={shop} />}

                {/* Note: All Products Grid is handled separately in HomeAllProducts */}
            </div>
        </section>
    )
}

export default FeatureSections