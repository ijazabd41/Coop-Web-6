import React from 'react'
import HorizontalProductCard from '../productcards/HorizontalProductCard'
const HorizontalCardContainer = ({ products }) => {
    return (
        <section >
            <div className='container'>
                <div className='flex justify-between items-center pb-3'>
                    <div>
                        <h2 className='text-2xl font-bold'>Products</h2>
                        <p className='text-base font-[500]'>Test</p>
                    </div>

                    <div>
                        <span>View all</span>
                    </div>
                </div>
                <div className='grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-12 my-2'>
                    {products?.sections?.[2]?.products?.slice(0, 6)?.map((product, index) => {
                        return (
                            <div key={index} className='col-span-4 '>
                                <HorizontalProductCard product={product} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default HorizontalCardContainer