import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { GoDotFill } from "react-icons/go";
import { BsArrowUpRightCircle } from "react-icons/bs";

const BlogCard = () => {
  return (
    <div className="flex flex-col p-4 gap-6 border rounded-lg">
      <div>
        <ImageWithPlaceholder className={"h-auto w-full rounded-lg"} />
      </div>
      <div className="flex gap-4 flex-col">
        <div className="flex gap-2 items-center">
          <p>Health & Nutrition</p>
          <GoDotFill />
          <p>Sep 28, 2025</p>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="font-bold text-xl">
              10 Everyday Vegetables That Boost Your Immune System
            </h2>
            <h4>
              Discover how common veggies like spinach, carrots, and broccoli
              can strengthen your i
            </h4>
          </div>
        </div>
      </div>
      <div>
        <button className="flex gap-1 items-center p-2 border rounded-md">
          Read More <BsArrowUpRightCircle />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
