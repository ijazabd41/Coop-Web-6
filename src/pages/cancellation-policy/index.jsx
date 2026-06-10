import MetaData from "@/components/metadata-component/MetaData";
import React from "react";
import Layout from "@/components/layout/Layout";
import BreadCrumb from "@/components/breadcrumb/BreadCrumb";

const CancellationPolicy = () => {
  return (
    <Layout>
      <MetaData
        pageName="/cancellation-policy"
        title="Cancellation Policy - Best Coop Discounts LLC"
        description="Cancellation Policy for Best Coop Discounts LLC"
      />
      <section>
        <BreadCrumb />
        <div className="container my-5 bodyBackgroundColor px-4 md:px-7 rounded pb-10 pt-5">
          <h1 className="text-3xl font-bold mb-6">Cancellation Policy</h1>
          <div className="flex flex-col gap-4 text-base leading-relaxed text-gray-800">
            <p>
              Customers may request cancellation of their order or service within 24 hours of placing the order, provided the order has not yet been processed, shipped, activated, or fulfilled.
            </p>

            <h2 className="text-xl font-bold mt-4">Cancellation Requests:</h2>
            <ul className="list-disc pl-5">
              <li>Requests must be submitted by email or through customer support.</li>
              <li>Orders already processed, shipped, delivered, activated, or completed may not be eligible for cancellation.</li>
            </ul>

            <h2 className="text-xl font-bold mt-4">Refund for Cancelled Orders:</h2>
            <p>
              Approved cancellations will be refunded to the original payment method used during the transaction.
            </p>
            <p>
              Refund processing may take between 10 to 45 days depending on the issuing bank and payment provider.
            </p>
            <p>
              Best Coop Discounts LLC reserves the right to reject cancellation requests that do not meet the above conditions.
            </p>

            <h2 className="text-xl font-bold mt-4">Customer Support:</h2>
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

export default CancellationPolicy;
