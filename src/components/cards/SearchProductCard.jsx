import Image from 'next/image'
import React from 'react'

const SearchProductCard = ({ product }) => {
    return (
        <div className="w-full flex gap-3 p-4">
            <div className="w-12 h-12">
                <Image src={"/logo.png"} className="w-full h-full object-contain" alt="product image" width={0} height={0} />
            </div>
            <div className="flex flex-col">
                <div className="text-xl font-semibold">Test Product</div>
                <div className="text-base font-normal">₹ 1000</div>
            </div>

        </div>
    )
}

export default SearchProductCard
