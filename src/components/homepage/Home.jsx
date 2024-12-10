import React from 'react'
import HomePageSlider from '../mainslider/MainSlider'
import Categories from '../categories/Categories'
import { useSelector } from 'react-redux'
import BrandSlider from '../shop-by-brands/BrandSlider'
import SellerSlider from '../shop-by-seller/SellerSlider'
import CountrySlider from '../shop-by-country/CountrySlider'
// import VerticleCardContainer from '../homepagefaturesection/VerticleCardContainer'
// import HorizontalCardContainer from '../homepagefaturesection/HorizontalCardContainer'
// import HorizontalProductSwiper from '../homepagefaturesection/HorizontalProductSwiper'
// import ProductSwiperWithImage from '../homepagefaturesection/ProductSwiperWithImage'
import FeatureSections from '../homepagefaturesection/FeatureSections'

const HomePage = () => {

    return (
        <>
            <div>
                {/* <HomePageSlider slider={shopData} /> */}
                {/* <Categories categories={shopData} />
                <BrandSlider brands={shopData} />
                <SellerSlider sellers={shopData} />
                <CountrySlider countries={shopData} /> */}
                <FeatureSections />
                {/* <VerticleCardContainer products={shopData} />
                <HorizontalCardContainer products={shopData} />
                <HorizontalProductSwiper products={shopData} />
                <ProductSwiperWithImage products={shopData} /> */}
            </div>
        </>
    )
}

export default HomePage