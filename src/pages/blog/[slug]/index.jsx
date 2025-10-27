import React from "react";
import dynamic from "next/dynamic";
const BlogDetailPage = dynamic(
  () => import("@/components/pagecomponents/BlogDetailPage"),
  { ssr: false }
);

const index = () => {
  return (
    <div>
      <BlogDetailPage />
    </div>
  );
};

export default index;
