import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import * as api from "@/api/apiRoutes"
import BrandCard from './BrandCard';
import { setFilterBrands } from '@/redux/slices/productFilterSlice';
const Brands = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const brandsPerPage = 12;

    const [brands, setBrands] = useState([])

    useEffect(() => {
        fetchBrands()
    }, [])


    const fetchBrands = async () => {
        try {
            const response = await api.getBrands({ limit: brandsPerPage, offset: 0 });
            // console.log(response.data);
            setBrands(response.data);
        } catch (error) {
            console.log("Error", error);
        }
    }

    const handleBrandClick = (brand) => {
        dispatch(setFilterBrands({ data: [brand?.id] }))
        router.push('/products')
    }



    return (
        <section>
            <BreadCrumb />
            <div className='container px-3 '>
                <div className='grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2  h-auto my-2 px-2'>
                    {
                        brands && brands?.map((brand) => {
                            return (
                                <div key={brand?.id} className='col-span-1' onClick={() => handleBrandClick(brand)}>
                                    <BrandCard brand={brand} />
                                </div>

                            )
                        })
                    }
                </div>

            </div>
        </section>
    )
}

export default Brands
