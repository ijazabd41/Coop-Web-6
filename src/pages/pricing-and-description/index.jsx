import MetaData from "@/components/metadata-component/MetaData";
import React from "react";
import Layout from "@/components/layout/Layout";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb";

const PricingAndDescription = () => {
  return (
    <Layout>
      <MetaData
        pageName="/pricing-and-description"
        title="Pricing & Product Information - Best Coop Discounts LLC"
        description="Pricing & Product Information for Best Coop Discounts LLC"
      />
      <section>
        <BreadCrumb />
        <div className="container my-5 bodyBackgroundColor px-4 md:px-7 rounded pb-10 pt-5">
          <h1 className="text-3xl font-bold mb-6">Pricing & Product Information</h1>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800">
            <p>
              Best Coop Discounts LLC provides clear and accurate descriptions, specifications, pricing, and availability information for all products and services offered through the website.
            </p>

            <h2 className="text-xl font-bold mt-4">Pricing:</h2>
            <ul className="list-disc pl-5">
              <li>All prices are displayed in AED (United Arab Emirates Dirham) unless otherwise specified.</li>
              <li>Prices are subject to change without prior notice.</li>
              <li>Applicable VAT and government charges will be displayed during checkout.</li>
              <li>The final amount payable will be displayed before payment confirmation.</li>
            </ul>

            <h2 className="text-xl font-bold mt-4">Product Information:</h2>
            <ul className="list-disc pl-5">
              <li>Product images are for illustration purposes only.</li>
              <li>Product specifications, descriptions, and features are updated regularly.</li>
              <li>Best Coop Discounts LLC makes every effort to ensure information accuracy; however, minor variations may occur.</li>
            </ul>

            <h2 className="text-xl font-bold mt-4">Order Acceptance:</h2>
            <p>
              The company reserves the right to reject or cancel any order due to pricing errors, stock availability, payment verification issues, or suspected fraudulent activity.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingAndDescription;
