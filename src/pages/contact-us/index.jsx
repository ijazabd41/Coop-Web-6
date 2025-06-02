import MetaData from "@/components/metadata-component/MetaData";
import dynamic from "next/dynamic";
const ContactUsPage = dynamic(
  () => import("@/components/pagecomponents/ContactUsPage"),
  { ssr: false },
);
import React from "react";

export async function getServerSideProps() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUBURL}/settings/get_seo_settings`,
      {
        params: {
          page_type: "Contact us",
        },
      },
    );
    let metatitle = process.env.NEXT_PUBLIC_META_TITLE;
    let metaDescription = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let metaKeywords = process.env.NEXT_PUBLIC_META_KEYWORDS;
    let ogImage = "";
    let schemaMarkup = null;
    if (process.env.NEXT_PUBLIC_SEO == "true") {
      const seoData = response.data.data;
      console.log("seoData", seoData);
      metatitle = seoData[0].meta_title;
      metaDescription = seoData[0].meta_description;
      metaKeywords = seoData[0].meta_keyword;
      ogImage = seoData[0].og_image_url;
      if (seoData[0].schema_markup) {
        schemaMarkup = extractJSONFromMarkup(seoData[0].schema_markup);
      }
    }
    return {
      props: {
        title: metatitle,
        description: metaDescription,
        keywords: metaKeywords,
        schemaMarkup: schemaMarkup ? JSON.stringify(schemaMarkup) : null,
        ogImage: ogImage,
      },
    };
  } catch (error) {
    console.log("error", error);
  }
}

const index = ({ title, description, keywords, schemaMarkup, ogImage }) => {
  return (
    <div>
      <MetaData
        title={`${title}`}
        description={description}
        keywords={keywords}
        schemaMarkup={schemaMarkup}
        ogImage={ogImage}
        pageName="/contact-us"
      />
      <ContactUsPage />
    </div>
  );
};

export default index;
