import React from "react";
const CategoriesPages = dynamic(
  () => import("@/components/pagecomponents/CategoriesPages"),
  { ssr: false },
);
import dynamic from "next/dynamic";

import MetaData from "@/components/metadata-component/MetaData";
import axios from "axios";
import { extractJSONFromMarkup } from "@/utils/helperFunction";

export async function getServerSideProps(context) {
  const { slug } = context.params;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/categories/get_seo_things`,
      {
        params: {
          slug: slug,
        },
      },
    );

    let metaTitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let markUpSchema = "";
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let og_image = null;
    if (process.env.NEXT_PUBLIC_SEO === "true") {
      const seoData = response.data.data || {};
      metaKeywords = seoData.meta_keywords || metaKeywords;
      metaTitle = seoData.meta_title || metaTitle;
      metaDescription = seoData.meta_description || metaDescription;
      og_image = seoData.og_image
      if (seoData.schema_markup) {
        markUpSchema = extractJSONFromMarkup(seoData.schema_markup) || "";
      }
    }
    return {
      props: {
        slug,
        metaKeywords,
        metaTitle,
        metaDescription,
        markUpSchema,
        og_image
      },
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return {
      notFound: true,
    };
  }
}

const Categories = ({
  slug,
  metaKeywords,
  metaTitle,
  metaDescription,
  markUpSchema,
  og_image
}) => {
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${slug}`;

  return (
    <div>
      <MetaData
        pageName="/categories/all"
        title={metaTitle}
        keywords={metaKeywords}
        description={metaDescription}
        structuredData={markUpSchema}
        ogUrl={pageUrl}
        ogImage={og_image}
        // key={`meta-${slug}`}
      />
      <CategoriesPages />
    </div>
  );
};

export default Categories;
