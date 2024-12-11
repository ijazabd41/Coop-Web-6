import Image from 'next/image';
import React from 'react';

const Seller = ({ seller }) => {
    return (
        <div className='group relative flex items-center bg-white p-4 rounded-md flex-col md:flex-row overflow-hidden hover:text-white backgroundColor '>
            {/* Hover overlay with transition */}
            <div className='absolute inset-0  bg-[#55AE7B] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out' />

            <div className='relative h-[80px] w-[80px]'>
                <Image
                    src={seller.logo_url}
                    alt={seller.name}
                    className='h-full w-full rounded-md'
                    fill
                />
            </div>

            <div className="relative whitespace-nowrap text-base font-bold ml-4 overflow-hidden text-ellipsis">
                {seller.name}
            </div>
        </div>
    );
};

export default Seller;