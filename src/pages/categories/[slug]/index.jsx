import React from 'react'
import CategoriesPages from '@/components/pagecomponents/CategoriesPages'
import MetaData from '@/components/metadata-component/MetaData'
import axios from "axios"
import { extractJSONFromMarkup } from '@/utils/helperFunction'

export async function getServerSideProps(context) {
    const { slug } = context.params
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/categories/get_seo_things`,
            {
                params: {
                    slug: slug
                }
            }
        )

        let metaTitle = process.env.NEXT_PUBLIC_META_TITLE
        let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION
        let markUpSchema = "";
        let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS
        if (process.env.NEXT_PUBLI_SEO === "true") {
            const seoData = response.data.data || {}
            metaKeywords = seoData.meta_keywords || metaKeywords
            metaTitle = seoData.meta_title || metaTitle
            metaDescription = seoData.meta_description || metaDescription
            markUpSchema = seoData.schema_markup || ""
        }
        return {
            props: {
                slug,
                metaKeywords,
                metaTitle,
                metaDescription,
                markUpSchema
            },
        }
    } catch (error) {
        console.error('Error fetching product data:', error)
        return {
            notFound: true,
        }
    }
}

const Categories = ({ slug, metaKeywords, metaTitle, metaDescription, markUpSchema }) => {
    let structuredData = null;

    if (markUpSchema != "") {
        structuredData = extractJSONFromMarkup(markUpSchema)

    }
    return (
        <>
            <MetaData pageName="/categories/all"
                title={metaTitle}
                keywords={metaKeywords}
                description={metaDescription}
                structuredData={structuredData}
                key={`meta-${slug}`}
            />
            <CategoriesPages />
        </>
    )
}

export default Categories