import React from "react";
// const SocialPages = dynamic(() => import('@/components/commonComponents/SocialPages'), { ssr: false })
import dynamic from "next/dynamic";
const ProductDescriptionPage = dynamic(
  () => import("@/components/pagecomponents/ProductDescriptionPage"),
  { ssr: false },
);
import MetaData from "@/components/metadata-component/MetaData";
import axios from "axios";
import { extractJSONFromMarkup } from "@/utils/helperFunction";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/products/get_seo_things`,
      {
        params: {
          slug: slug,
        },
      },
    );
    let metatitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let schemaMarkup = null;
    if (process.env.NEXT_PUBLIC_SEO == "true") {
      const seoData = response.data.data;
      metatitle = seoData.meta_title;
      (metaDescription = seoData.meta_description),
        (metaKeywords = seoData.meta_keywords);
      if (seoData.schema_markup) {
        schemaMarkup = extractJSONFromMarkup(seoData.schema_markup);
      }
    }
    return {
      props: {
        slug: slug,
        title: metatitle,
        description: metaDescription,
        keywords: metaKeywords,
        schemaMarkup: schemaMarkup ? JSON.stringify(schemaMarkup) : null,
      },
    };
  } catch (error) {
    console.log("error", error);
  }
}

export default function Index({
  slug,
  title,
  description,
  keywords,
  schemaMarkup,
}) {
  const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`;
  return (
    <>
      <MetaData
        pageName="/product/"
        title={title}
        description={description}
        keywords={keywords}
        structuredData={schemaMarkup}
        ogUrl={productUrl}
      />
      <ProductDescriptionPage />
    </>
  );
}
