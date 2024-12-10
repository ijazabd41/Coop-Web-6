import React, { useEffect, useState } from 'react'
import HorizontalProductCard from '../productcards/HorizontalProductCard'
import { useSelector } from 'react-redux';
import Image from 'next/image';
const HorizontalCardContainer = ({ section }) => {
    const shop = useSelector(state => state.Shop.shop);
    const [promotionImage, setPromotionImage] = useState(null)
    useEffect(() => {
        const promotionImageBelowSection = shop?.offers?.filter((offer) => offer?.position == "below_section");
        const image = promotionImageBelowSection?.filter((offer) => {
            return offer?.section?.title == section?.title
        })
        setPromotionImage(image)
    }, [section])
    return (
        <section >
            {section?.products?.length > 0 ? <div className='container'>
                <div className='flex justify-between items-center pb-3'>
                    <div>
                        <h2 className='text-2xl font-bold'>{section?.title}</h2>
                        <p className='text-base font-[500]'>{section?.short_description}</p>
                    </div>

                    <div>
                        <span>View all</span>
                    </div>
                </div>
                <div className='grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-12 my-2'>
                    {section?.products?.slice(0, 6)?.map((product, index) => {
                        return (
                            <div key={index} className='col-span-4 '>
                                <HorizontalProductCard product={product} />
                            </div>
                        )
                    })}
                </div>
            </div> : null}
            <div className='container mb-6'>
                {promotionImage && promotionImage?.map((offer) => {
                    return (
                        <div className='relative'>
                            <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default HorizontalCardContainer