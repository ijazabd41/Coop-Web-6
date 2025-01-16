import Image from 'next/image'
import React from 'react'

const SellerListingCard = ({ seller }) => {
    return (
        <div className='flex flex-col category-card p-3 hover:textPrimaryColor hover:cardBorder rounded-sm headerBackgroundColor cursor-pointer'>
            <div className='gap-3 flex flex-col items-center'>
                <div className='relative h-[120px] w-[120px]'>
                    <Image src={seller.logo_url} alt='Category Image' width={0} height={0} className='rounded-sm w-full h-full object-cover p-2' />
                </div>
                <div className="font-semibold h-[42px] leading-5 mt-2 text-center w-full truncate">{seller.store_name}</div>
            </div>
        </div>
    )
}

export default SellerListingCard
