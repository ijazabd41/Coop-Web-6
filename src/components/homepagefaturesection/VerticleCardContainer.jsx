import React from 'react'
import VerticleProductCard from '../productcards/VerticleProductCard'

const VerticleCardContainer = ({ products }) => {
    return (
        <section className='my-6'>
            <div className='py-6 container'>
                <div className='flex justify-between items-center pb-3'>
                    <div>
                        <h2 className='text-2xl font-bold'>Products</h2>
                        <p className='text-base font-[500]'>Test</p>
                    </div>

                    <div>
                        <span>View all</span>
                    </div>
                </div>
                <div className='grid grid-cols-6 md:grid-cols-9 lg:grid-cols-12 my-4'>
                    {products?.sections?.[2]?.products?.map((product, index) => {
                        return (
                            <div className='col-span-3' key={index}>
                                <VerticleProductCard product={product} />
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

export default VerticleCardContainer