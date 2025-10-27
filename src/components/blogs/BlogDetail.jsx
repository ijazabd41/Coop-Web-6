import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { t } from "@/utils/translation";

const BlogDetail = () => {
  return (
    <div className="">
      <div className="backgroundColor">
        <div className="container flex flex-col gap-6 py-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              10 Everyday Vegetables That Boost Your Immune System
            </h1>
            <p className="font-medium">
              Discover how common veggies like spinach, carrots, and broccoli
              can strengthen your immunity. Simple, affordable, and powerful for
              your daily meals.
            </p>
          </div>
          <div>
            <ImageWithPlaceholder className={"h-full w-full rounded-md"} />
          </div>
          <div className="p-3 flex gap-10 bodyBackgroundColor rounded-lg">
            <div className="flex flex-col ">
              <p className="subTextColor">{t("categories")}</p>
              <h4 className="font-bold">Health & Nutrition</h4>
            </div>
            <div className="border h-12 "></div>
            <div className="flex flex-col ">
              <p className="subTextColor">{t("categories")}</p>
              <h4 className="font-bold">Health & Nutrition</h4>
            </div>
            <div className="border h-12 "></div>
            <div className="flex flex-col ">
              <p className="subTextColor">{t("categories")}</p>
              <h4 className="font-bold">Health & Nutrition</h4>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-12"></div>
    </div>
  );
};

export default BlogDetail;
