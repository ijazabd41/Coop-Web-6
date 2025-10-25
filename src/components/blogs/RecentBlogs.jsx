import React from "react";
import { t } from "@/utils/translation";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";

const RecentBlogs = () => {
  return (
    <div className="flex flex-col p-4 gap-6 border rounded-lg backgroundColor">
      <h2 className="font-bold  text-xl underline">{t("recent_blogs")}</h2>
      <div className="flex flex-col gap-6">
        <div className="flex p-2 gap-2 headerBackgroundColor cursor-pointer rounded-lg">
          <ImageWithPlaceholder className={"rounded-md h-20 w-32"} />
          <div className="flex flex-col gap-2 ">
            <p className="text-sm font-normal">Health & Nutrition</p>
            <h2 className="font-bold text-base">
              10 Everyday Vegetables That Boost Your Immun
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;
