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
import CoopMembershipBenefits from './CoopMembershipBenefits';
import TrustedPartner from './TrustedPartner';

import HomeOfferSection from './HomeOfferSection';

import HomeOfferSection from './HomeOfferSection';

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
                    const titleStr = String(section?.translations?.title || "").toLowerCase();
                    const isRecommended = titleStr.includes("recommended");
                    const isFeatured = titleStr.includes("featured");

                    let UIComponent = null;
                    if (section?.style_web == "style_1") {
                        UIComponent = <HorizontalProductSwiper section={section} index={index} key={section?.id} />;
                    } else if (section?.style_web == "style_2") {
                        UIComponent = <VerticleCardContainer section={section} index={index} key={section?.id} />;
                    } else if (section?.style_web == "style_3") {
                        UIComponent = <HorizontalCardContainer section={section} index={index} key={section?.id} />;
                    } else if (section?.style_web == "style_4") {
                        UIComponent = <ProductSwiperWithImage section={section} index={index} key={section?.id} />;
                    }

                    return (
                        <React.Fragment key={section?.id}>
                            {isFeatured && <CoopMembershipBenefits />}
                            {UIComponent}
                        </React.Fragment>
                    );
                })}

                {/* 9. Shop By Brand */}
                {shop?.brands?.length > 0 && <BrandSlider brands={shop} />}

                {/* 10. Trusted Partner Checkout Section */}
                <TrustedPartner />

                {/* Note: All Products Grid is handled separately in HomeAllProducts */}
            </div>
        </section>
    )
}

export default FeatureSections