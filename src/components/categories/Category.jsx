import React, { useEffect, useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import * as api from "@/api/apiRoutes"
import CategoryCard from './CategoryCard'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setFilterCategory } from '@/redux/slices/productFilterSlice'


const Category = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { slug } = router.query

    const [categories, setCategories] = useState([])

    const categoryPerPage = 12;
    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchCategories = async (slug = "") => {
        console.log("slig", slug)
        let catSlug = slug == "all" ? "" : slug
        console.log(catSlug)
        try {
            const result = await api.getCategories({ limit: categoryPerPage, slug: catSlug })
            setCategories(result)
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleCategoryClick = (category) => {
        if (category?.has_child) {
            fetchCategories(category?.slug)
            router.push(`/categories/${category?.slug}`)
        } else {
            dispatch(setFilterCategory({ data: category?.id }))
            router.push(`/products`)

        }
    }

    return (
        <section>
            <BreadCrumb />
            <div className='container '>
                <div className='grid grid-cols-12 my-10 '>
                    {
                        categories && categories?.data?.map((category) => {
                            return (
                                <div key={category?.id} className='col-span-2' onClick={() => handleCategoryClick(category)}>
                                    <CategoryCard category={category} />
                                </div>

                            )
                        })
                    }
                </div>

            </div>
        </section>
    )
}

export default Category