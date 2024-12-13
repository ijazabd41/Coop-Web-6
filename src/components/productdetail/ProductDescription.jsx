import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import { Progress } from "@/components/ui/progress"
import * as api from "@/api/apiRoutes";

const ProductDescription = ({ product }) => {
    const [selectedTab, setSelectedTab] = useState(0)
    const [ratingData, setRatingData] = useState({})

    useEffect(() => {
        fetchRatings()
    }, [product?.id])

    const ratingsCount = 10;

    const fetchRatings = async () => {
        try {
            const result = await api.getProductRatings({ id: product?.id, limit: ratingsCount, offset: 0 })
            setRatingData(result?.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleProductDescSelect = () => {
        setSelectedTab(0)
    }

    const handleProductReviewSelect = () => {
        setSelectedTab(1)
    }

    const ratings = [
        { stars: 5, count: ratingData?.five_star_rating },
        { stars: 4, count: ratingData?.four_star_rating },
        { stars: 3, count: ratingData?.three_star_rating },
        { stars: 2, count: ratingData?.two_star_rating },
        { stars: 1, count: ratingData?.one_star_rating },
    ];
    const totalRatings = ratings.reduce((total, rating) => total + rating.count, 0);
    const averageRating = (
        ratings.reduce((sum, { stars, count }) => sum + stars * count, 0) / totalRatings
    ).toFixed(1);

    return (
        <div>
            <div className=' rounded-sm my-2 cardBorder '>
                <div className='flex gap-4 p-4   border-b-2'>
                    <span className={`text-xl px-4 py-2 rounded-sm cursor-pointer ${selectedTab == 0 ? "bg-[#29363F] text-white" : " "}`} onClick={handleProductDescSelect}>{t("product_desc_title")}</span>
                    <span className={`text-xl px-4 py-2 rounded-sm cursor-pointer ${selectedTab == 1 ? "bg-[#29363F] text-white" : ""}`} onClick={handleProductReviewSelect}>{t("rating_and_reviews")}</span>
                </div>
                <div className=' '>
                    {selectedTab == 0 ?
                        product?.description !== "" ? <div className='p-4'>
                            <div dangerouslySetInnerHTML={{ __html: product?.description }} />
                        </div> : <p>No Description available</p> : <></>
                    }
                    {selectedTab == 1 &&
                        <div className='p-4'> <div className="p-4  rounded-md w-full max-w-md">

                            <div className="flex items-center space-x-4 cartButtonBackground p-4 rounded-sm">
                                <div className="text-4xl font-bold text-white primaryBackColor  p-4 rounded-md">
                                    {ratingData?.average_rating?.toFixed(2)}
                                </div>
                                <div>
                                    <p className="text-xl font-semibold">{t("overall_rating")}</p>
                                    <p className="text-lg font-bold ">{totalRatings.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Star Ratings */}
                            <div className="mt-4">
                                {ratings.map(({ stars, count }) => {
                                    const percentage = (count / totalRatings) * 100;

                                    return (
                                        <div key={stars} className="flex items-center space-x-2 mb-2">
                                            <span className="text-lg font-medium">{stars}</span>
                                            <span className="text-yellow-500">&#9733;</span>
                                            <Progress value={percentage} className="w-full h-2 " />
                                            <span className="text-sm font-medium">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div></div>
                    }
                </div>
            </div>
        </div>

    )
}

export default ProductDescription