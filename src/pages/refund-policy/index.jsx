import MetaData from "@/components/metadata-component/MetaData";
import React from "react";
import Layout from "@/components/layout/Layout";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb";

const RefundPolicy = () => {
  return (
    <Layout>
      <MetaData
        pageName="/refund-policy"
        title="Return & Refund Policy - Best Coop Discounts LLC"
        description="Return & Refund Policy for Best Coop Discounts LLC"
      />
      <section>
        <BreadCrumb />
        <div className="container my-5 bodyBackgroundColor px-4 md:px-7 rounded pb-10 pt-5">
          <h1 className="text-3xl font-bold mb-6">Return & Refund Policy</h1>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800">
            <p>
              Best Coop Discounts LLC is committed to customer satisfaction. If you receive a damaged product, defective item, incorrect product, or an item that does not match your order, you may request a return within 7 days from the date of delivery.
            </p>

            <h2 className="text-xl font-bold mt-4">Eligibility for Returns:</h2>
            <ul className="list-disc pl-5">
              <li>Product must be unused and in its original condition.</li>
              <li>Product must be returned in its original packaging.</li>
              <li>Product must not be tampered with, damaged by the customer, or partially used.</li>
              <li>Proof of purchase/order confirmation must be provided.</li>
            </ul>

            <h2 className="text-xl font-bold mt-4">Non-Returnable Items:</h2>
            <ul className="list-disc pl-5">
              <li>Used products.</li>
              <li>Products damaged due to misuse.</li>
              <li>Digital products, downloadable items, subscriptions, or services already delivered or consumed.</li>
              <li>Promotional or clearance items unless defective.</li>
            </ul>

            <h2 className="text-xl font-bold mt-4">Refund Process:</h2>
            <p>
              Once the returned product is received and inspected, Best Coop Discounts LLC will notify the customer regarding approval or rejection of the refund request.
            </p>
            <p>
              Approved refunds will be processed to the original mode of payment used during the purchase.
            </p>
            <p>
              Refunds may take between 10 to 45 days to appear in the customer's account depending on the issuing bank and payment provider.
            </p>
            <p>
              Shipping and handling charges are non-refundable unless the return is due to an error on our part.
            </p>

            <h2 className="text-xl font-bold mt-4">For refund requests, customers may contact:</h2>
            <p>
              <strong>Email:</strong> support@yourdomain.com<br />
              <strong>Phone:</strong> +971 XX XXX XXXX
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicy;
