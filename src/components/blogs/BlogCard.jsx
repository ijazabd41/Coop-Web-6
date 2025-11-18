import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { GoDotFill } from "react-icons/go";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { t } from "@/utils/translation";
import { useRouter } from "next/navigation";
import { formatOnlyDate } from "@/lib/utils";

const BlogCard = ({ blog }) => {
  const router = useRouter();
  const handleViewMore = async (slug) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="flex flex-col p-4 gap-6 border rounded-lg h-fit bodyBackgroundColor">
      <div>
        <ImageWithPlaceholder
          className={"h-[264px] w-full rounded-lg"}
          src={blog?.image_url}
          alt={blog?.title}
        />
      </div>
      <div className="flex gap-4 flex-col">
        <div className="flex gap-2 items-center">
          <p>{blog?.category?.name}</p>
          <GoDotFill />
          <p>{formatOnlyDate(blog?.created_at)}</p>
        </div>
        <div className="flex flex-col gap-2 min-h-42">
          <div>
            <h2 className="font-bold text-xl ">
              {blog?.title?.slice(0, 32) + "..."}
            </h2>
            <h4
              className="blog-card-description"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const div = document.createElement("div");
                  div.innerHTML = blog?.description || "";
                  const text = div.textContent || div.innerText || "";
                  return text.length > 50 ? text.slice(0, 50) + "..." : text;
                })(),
              }}
            ></h4>
          </div>
        </div>
      </div>
      <div>
        <button
          className="flex gap-1 items-center p-2 border rounded-md"
          onClick={() => handleViewMore(blog?.slug)}
        >
          {t("readMore")} <BsArrowUpRightCircle />
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
