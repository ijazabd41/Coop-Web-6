import React from "react";
import dynamic from "next/dynamic";
const BlogsPage = dynamic(
  () => import("@/components/pagecomponents/BlogsPage"),
  { ssr: false }
);

const index = () => {
  return (
    <div>
      <BlogsPage />
    </div>
  );
};

export default index;
