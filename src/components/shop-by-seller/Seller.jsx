import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { isRtl } from '@/lib/utils';

const Seller = ({ seller }) => {
    const rtl = isRtl();
    return (
        <div className={`group relative flex items-center bg-white p-4 rounded-md flex-col md:flex-row overflow-hidden hover:text-white  hover:cursor-pointer `}>
            {/* Hover overlay with transition */}
            <div className={`absolute inset-0  bg-[#55AE7B] ${rtl ? 'translate-x-full' : '-translate-x-full'} group-hover:translate-x-0 transition-transform duration-500 ease-in-out`} />

            <div className='relative h-[80px] w-[80px]'>
                <ImageWithPlaceholder
                    src={seller.logo_url}
                    alt={seller.name}
                    className='h-full w-full rounded-md'
                />
            </div>

            <div className="relative whitespace-nowrap text-base font-bold mx-4 overflow-hidden text-ellipsis">
                {seller.name}
            </div>
        </div>
    );
};

export default Seller;