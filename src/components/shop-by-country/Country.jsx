import Image from 'next/image'
import React from 'react'

const Country = ({ country }) => {
    return (
        <div className='flex flex-col items-center hover:countryHover p-3 sm:p-4 md:p-6 rounded-sm transition-all duration-300 headerBackgroundColor hover:cursor-pointer'>
            <div className='relative aspect-square w-full max-w-[12rem]'>
                <Image
                    src={`${process.env.NEXT_PUBLIC_APP_API_URL}/storage/${country.logo}`}
                    alt={country.name}
                    width={0}
                    height={0}
                    className='object-contain w-full h-full rounded-sm'
                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
            </div>
            <div className='w-full text-sm sm:text-base font-semibold leading-normal sm:leading-[26px] overflow-hidden text-center truncate whitespace-nowrap py-2'>
                {country.name}
            </div>
        </div>
    )
}

export default Country