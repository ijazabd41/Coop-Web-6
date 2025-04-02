import React from 'react'
// const SocialPages = dynamic(() => import('@/components/commonComponents/SocialPages'), { ssr: false })
import dynamic from 'next/dynamic'
const ProductDescriptionPage = dynamic(() => import('@/components/pagecomponents/ProductDescriptionPage'), { ssr: false })
import MetaData from '@/components/metadata-component/MetaData'
import axios from 'axios'
import { extractJSONFromMarkup } from '@/utils/helperFunction'

export default function Index({ title }) {
    return (
        <>
            {/* <Head>
                <title>{title}</title>
                <meta name="description" content="Example meta description" />
            </Head> */}
            <MetaData pageName="/product/" title={title} />
            <ProductDescriptionPage />
        </>
    )
}

export async function getServerSideProps(context) {
    const { slug } = context.params
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/products/get_seo_things`,
            {
                params: {
                    slug: slug
                }
            }
        )

        let metatitle = process.env.NEXT_PUBLIC_META_TITLE
        let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION
        let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS
        if (process.env.NEXT_PUBLIC_SEO == "true") {
            console.log("response", response.data.data)
            const seoData = response.data.data
            metatitle = seoData.meta_title
        }
        return {
            props: {
                title: metatitle
            }
        }
    } catch (error) {
        console.log("error", error)
    }
}
