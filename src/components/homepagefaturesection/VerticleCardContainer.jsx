import React, { useEffect, useState } from 'react'
import VerticleProductCard from '../productcards/VerticleProductCard'
import { useSelector } from 'react-redux';
import Image from 'next/image';

const VerticleCardContainer = ({ section }) => {

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
        <div>
            {section?.products?.length > 0 ? <section className=''>
                <div className='py-6 container'>
                    <div className='flex justify-between items-center pb-3'>
                        <div>
                            <h2 className='text-2xl font-bold'>{section?.title}</h2>
                            <p className='text-base font-[500]'>{section?.short_description}</p>
                        </div>

                        <div>
                            <span>View all</span>
                        </div>
                    </div>
                    <div className='grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12 my-4'>
                        {section?.products?.map((product, index) => {
                            return (
                                <div className='col-span-3' key={index}>
                                    <VerticleProductCard product={product} />
                                </div>
                            )
                        })}
                    </div>

                </div>
            </section> : null
            }
            <div className='container mb-6'>
                {promotionImage && promotionImage?.map((offer) => {
                    return (
                        <div className='relative'>
                            <Image src={offer?.image_url} alt='Offer image' height={0} width={0} className='object-contain h-full w-full rounded-sm' />
                        </div>
                    )
                })}
            </div>
        </div>


    )
}

export default VerticleCardContainer