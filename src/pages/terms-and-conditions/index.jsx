import MetaData from "@/components/metadata-component/MetaData";
import React from "react";
import Layout from "@/components/layout/Layout";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb";

const TermsAndConditions = () => {
  return (
    <Layout>
      <MetaData
        pageName="/terms-and-conditions"
        title="Terms & Conditions - Best Coop Discounts LLC"
        description="Terms & Conditions for Best Coop Discounts LLC"
      />
      <section>
        <BreadCrumb />
        <div className="container my-5 bodyBackgroundColor px-4 md:px-7 rounded pb-10 pt-5">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800">
            <p>
              By accessing and using this website, you agree to comply with and be bound by these Terms and Conditions.
            </p>
            <p>
              Best Coop Discounts LLC reserves the right to update these terms at any time without prior notice.
            </p>
            <p>
              Users are responsible for maintaining the confidentiality of their account information and for all activities conducted under their account.
            </p>
            <p>
              The company reserves the right to refuse service, terminate accounts, or cancel orders when necessary.
            </p>
            <p>
              Any disputes arising from the use of this website shall be governed by the laws of the United Arab Emirates.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsAndConditions;
