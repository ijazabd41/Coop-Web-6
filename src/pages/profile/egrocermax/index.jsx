import MetaData from "@/components/metadata-component/MetaData";
const EgrocerMax = dynamic(
  () => import("@/components/pagecomponents/EgrocerMaxPage"),
  { ssr: false }
);
import dynamic from "next/dynamic";
import React from "react";

const index = () => {
  return (
    <div>
      <MetaData
        pageName="/profile/order-history"
        title={`eGrocerMax - ${process.env.NEXT_PUBLIC_META_TITLE}`}
      />
      <EgrocerMax />
    </div>
  );
};

export default index;
