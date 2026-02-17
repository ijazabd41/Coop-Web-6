import React from 'react'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const CategoryCard = ({ category }) => {

    return (
        <div className='flex flex-col category-card p-4 border border-transparent hover:textPrimaryColor hover:cardBorder rounded-xl categoryCardBackground cursor-pointer '>
            <div className='gap-3 flex flex-col items-center'>
                <div className='relative h-[122px] w-[122px]'>
                    <ImageWithPlaceholder src={category.image_url} width={1000} height={1000} alt='Category Image' className='rounded-full w-full h-full object-cover p-2' />
                </div>
                <div className="font-semibold h-[42px] leading-5 mt-2 text-center w-full truncate">{category?.translations?.name ?? category?.name}</div>
            </div>
        </div>
    )
}

export default CategoryCard