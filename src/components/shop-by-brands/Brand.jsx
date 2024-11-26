import Image from 'next/image'
import React from 'react'

const Brand = ({ brand }) => {
    return (
        <div className="backgroundColor  rounded-lg text-center flex flex-col items-center px-4 py-6 gap-6">
            <div className='h-[120px] w-[120px] relative'>
                <Image src={brand.image_url} alt={brand.name} className="mx-auto h-full w-full mb-2" fill />
            </div>
            <span className="block text-base font-semibold leading-[26px] overflow-hidden text-center text-ellipsis whitespace-nowrap w-full">{brand.name}</span>
        </div>
    )
}

export default Brand