import React, { useEffect, useState } from 'react';
import { imageUrl } from '@/api/odoo/utils';

const MobileAppBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/odoo/api/bcd-deal-day-slider/12?by_AJR=1');
                const json = await res.json();
                if (json.success === 1 && json.data) {
                    setBanners(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch mobile app banners", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading || banners.length === 0) return null;

    return (
        <div className="container mx-auto px-2 mt-8 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mobile App</h2>
            <div className="flex flex-col gap-4">
                {banners.map((banner) => (
                    banner.banner_image && (
                        <div key={banner.id} className="w-full rounded-lg overflow-hidden">
                            <img
                                src={imageUrl(banner.banner_image)}
                                alt={banner.name || "Mobile App"}
                                className="w-full h-[200px] md:h-[300px] lg:h-[350px] object-cover object-center rounded-lg"
                                loading="lazy"
                            />
                        </div>
                    )
                ))}
            </div>
        </div>
    );
};

export default MobileAppBanner;
