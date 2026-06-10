import MetaData from "@/components/metadata-component/MetaData";
import React from "react";
import Layout from "@/components/layout/Layout";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <MetaData
        pageName="/privacy-policy"
        title="Privacy Policy - Best Coop Discounts LLC"
        description="Privacy Policy for Best Coop Discounts LLC"
      />
      <section>
        <BreadCrumb />
        <div className="container my-5 bodyBackgroundColor px-4 md:px-7 rounded pb-10 pt-5">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800">
            <p>
              Best Coop Discounts LLC respects customer privacy and is committed to protecting personal information.
            </p>

            <h2 className="text-xl font-bold mt-4">Information collected may include:</h2>
            <ul className="list-disc pl-5">
              <li>Name</li>
              <li>Contact details</li>
              <li>Delivery information</li>
              <li>Payment-related information</li>
            </ul>

            <p>
              Personal information is used solely for order processing, customer support, service improvement, and legal compliance.
            </p>
            <p>
              Customer information will not be sold, rented, or shared with third parties except where required for order fulfillment or legal obligations.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
