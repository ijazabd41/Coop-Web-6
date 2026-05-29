import React from 'react';
import { useSelector } from 'react-redux';
import { FaRocket, FaUndo, FaLock, FaHeadset } from 'react-icons/fa';

const PromoStrip = () => {
    const theme = useSelector(state => state.Theme.theme);
    const bgColor = theme === "light" ? "bg-white" : "bg-gray-800";
    const textColor = theme === "light" ? "text-gray-800" : "text-white";
    const subTextColor = theme === "light" ? "text-gray-500" : "text-gray-400";
    const borderColor = theme === "light" ? "border-gray-200" : "border-gray-700";

    const promos = [
        {
            icon: <FaRocket className="text-primaryColor text-2xl" />,
            title: "Free Delivery",
            sub: "Orders above AED 50"
        },
        {
            icon: <FaUndo className="text-primaryColor text-2xl" />,
            title: "Easy Returns",
            sub: "7-day return policy"
        },
        {
            icon: <FaLock className="text-primaryColor text-2xl" />,
            title: "Secure Payment",
            sub: "100% safe checkout"
        },
        {
            icon: <FaHeadset className="text-primaryColor text-2xl" />,
            title: "24/7 Support",
            sub: "055 594 4719"
        }
    ];

    return (
        <section className={`py-6 border-y ${borderColor} ${bgColor}`}>
            <div className='container'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    {promos.map((promo, idx) => (
                        <div key={idx} className='flex items-center gap-4 justify-center md:justify-start'>
                            <div className='flex-shrink-0'>
                                {promo.icon}
                            </div>
                            <div>
                                <h4 className={`font-bold text-base ${textColor}`}>{promo.title}</h4>
                                <p className={`text-sm ${subTextColor}`}>{promo.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromoStrip;
