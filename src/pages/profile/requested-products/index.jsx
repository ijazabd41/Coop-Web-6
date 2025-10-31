import React from "react";
import dynamic from "next/dynamic";
const RequestProducts = dynamic(
  () => import("@/components/pagecomponents/RequestedProductPage"),
  {
    ssr: false,
  }
);

const index = () => {
  return (
    <div>
      <RequestProducts />
    </div>
  );
};

export default index;
