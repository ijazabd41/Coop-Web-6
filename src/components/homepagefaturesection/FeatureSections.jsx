import React from 'react'
import { useSelector } from 'react-redux'
import HomePageSlider from '@/components/mainslider/MainSlider'
import HorizontalCardContainer from './HorizontalCardContainer';
import VerticleCardContainer from './VerticleCardContainer';
import ProductSwiperWithImage from './ProductSwiperWithImage';
import HorizontalProductSwiper from './HorizontalProductSwiper';
import Categories from '../categories/Categories';
import BrandSlider from '../shop-by-brands/BrandSlider';
import CountrySlider from '../shop-by-country/CountrySlider';
import SellerSlider from '../shop-by-seller/SellerSlider';
import Image from 'next/image';
const FeatureSections = () => {

    const shop = useSelector(state => state.Shop.shop)

    // Advertise banner
    const aboveHomeSlider = shop?.offers?.filter((offer) => offer?.position === "top");
    const BelowHomeSlider = shop?.offers?.filter((offer) => offer.position === "below_slider");
    const BelowCategory = shop?.offers?.filter((offer) => offer.position === "below_category");
    const BelowSectionOfferArray = shop?.offers?.filter((offer) => offer.position === "below_section");

    // Feature sections 
    const aboveHomeSection = shop?.sections?.filter((section) => section?.position == "top");
    const belowHomeSliderSection = shop?.sections?.filter((section) => section?.position == "below_slider");
    const belowCategorySection = shop?.sections?.filter((section) => section?.position == "below_category");
    const belowBrandsSection = shop?.sections?.filter((section) => section?.position == "custom_below_shop_by_brands");
    const belowCoutrySection = shop?.sections?.filter((section) => section?.position == "below_shop_by_country_of_origin");
    const belowShopSellerSection = shop?.sections?.filter((section) => section?.position == "below_shop_by_seller");



    return (
        <section>
            <div >
                <div className='container'>
                    {aboveHomeSlider && aboveHomeSlider?.map((offer) => {
                        return (
                            <div className='py-6  relative'>
                                <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                            </div>
                        )
                    })}
                </div>
                {aboveHomeSection && aboveHomeSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} />)
                    }

                })}
                <HomePageSlider slider={shop} />
                <div className='container'>
                    {BelowHomeSlider && BelowHomeSlider?.map((offer) => {
                        return (
                            <div className='py-6  relative'>
                                <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                            </div>
                        )
                    })}
                </div>
                {belowHomeSliderSection && belowHomeSliderSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} />)
                    }

                })}
                <Categories categories={shop} />
                <div className='container'>
                    {BelowCategory && BelowCategory?.map((offer) => {
                        return (
                            <div className='py-6  relative'>
                                <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                            </div>
                        )
                    })}
                </div>
                {belowCategorySection && belowCategorySection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} />)
                    }

                })}
                <BrandSlider brands={shop} />
                {belowBrandsSection && belowBrandsSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} />)
                    }

                })}

                <SellerSlider sellers={shop} />
                {belowShopSellerSection && belowShopSellerSection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} />)
                    }

                })}
                <CountrySlider countries={shop} />
                {belowCoutrySection && belowCoutrySection?.map((section, index) => {
                    if (section?.style_web == "style_1") {
                        return (<HorizontalProductSwiper section={section} index={index} />)
                    } else if (section?.style_web == "style_2") {
                        return (<VerticleCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_3") {
                        return (<HorizontalCardContainer section={section} index={index} />)
                    } else if (section?.style_web == "style_4") {
                        return (<ProductSwiperWithImage section={section} index={index} />)
                    }

                })}
            </div>
        </section>
    )
}

export default FeatureSections