import React from 'react'
import Logo from "/public/egrocerLogo.png"
import Image from 'next/image'

const CategoryCard = ({ category }) => {

    return (
        <div className='flex flex-col category-card p-3 hover:textPrimaryColor hover:cardBorder rounded-md headerBackgroundColor cursor-pointer'>
            <div className='gap-3 flex flex-col items-center'>
                <div className='relative h-[122px] w-[122px]'>
                    <Image src={category.image_url} alt='Category Image' fill className='rounded-full object-cover p-2' />
                </div>
                <div className="block  font-semibold h-[42px] leading-5 mt-[22px] overflow-hidden text-center w-full">{category.name}</div>
            </div>
        </div>
    )
}

export default CategoryCard