import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import * as api from '@/api/apiRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterByCountry } from '@/redux/slices/productFilterSlice'
import { useRouter } from 'next/router'
import Country from './Country'
const CountryListing = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const city = useSelector(state => state.City.city);

    const [countries, setCountries] = useState([])
    const handleFetchCountries = async () => {
        try {
            const response = await api.getCountries({
                limit: 10,
                offset: 0
            })
            console.log(response?.data);
            setCountries(response?.data);
        } catch (error) {
            console.log("Error:", error)
        }
    }
    useEffect(() => {
        handleFetchCountries()
    }, [])
    const handleCountryClick = (country) => {
        dispatch(setFilterByCountry({ data: country?.id }));
        router.push(`/products`)
    }
    return (
        <section>
            <BreadCrumb />
            <div className='container'>
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto my-5 p-2`}>
                    {
                        countries && countries?.map((country) => {
                            return (
                                <div key={country?.id} className={"col-span-1"} onClick={() => handleCountryClick(country)}>
                                    <Country country={country} />
                                </div>

                            )
                        })
                    }
                </div>

            </div>
        </section>
    )
}

export default CountryListing
