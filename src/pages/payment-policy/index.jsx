import MetaData from "@/components/metadata-component/MetaData";
import React from "react";
import Layout from "@/components/layout/Layout";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb";

const PaymentPolicy = () => {
  return (
    <Layout>
      <MetaData
        pageName="/payment-policy"
        title="Payment Policy - Best Coop Discounts LLC"
        description="Payment Policy for Best Coop Discounts LLC"
      />
      <section>
        <BreadCrumb />
        <div className="container my-5 bodyBackgroundColor px-4 md:px-7 rounded pb-10 pt-5">
          <h1 className="text-3xl font-bold mb-6">Payment Policy</h1>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800">
            <p>
              Best Coop Discounts LLC accepts secure online payments through Visa, Mastercard, and other payment methods approved by our payment gateway provider.
            </p>

            <h2 className="text-xl font-bold mt-4">Payment Security:</h2>
            <ul className="list-disc pl-5">
              <li>All transactions are encrypted using SSL technology.</li>
              <li>Cardholder information is not stored on our servers.</li>
              <li>Payments are processed through secure PCI-DSS compliant payment gateways.</li>
            </ul>

            <h2 className="text-xl font-bold mt-4">Currency:</h2>
            <p>
              All transactions are processed in AED (United Arab Emirates Dirham).
            </p>
            <p>
              The cardholder must retain a copy of transaction records and merchant policies and rules.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentPolicy;
