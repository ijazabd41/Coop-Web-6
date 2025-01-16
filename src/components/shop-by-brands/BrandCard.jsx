import Image from 'next/image'
import React from 'react'

const BrandCard = ({ brand }) => {
    return (
        <div className="backgroundColor  rounded-sm text-center flex flex-col items-center px-4 py-6 gap-2 hover:bg-transparent hover:cardBorder hover:cursor-pointer">
            <div>
                <Image src={brand?.image_url} alt={brand?.name} className="rounded-sm mx-auto h-full w-full object-cover mb-2" width={0} height={0}  />
            </div>
            <div className="text-base font-semibold leading-[26px] text-center w-full truncate">{brand?.name}</div>
        </div>
    )
}

export default BrandCard