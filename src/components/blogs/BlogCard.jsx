import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { GoDotFill } from "react-icons/go";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { t } from "@/utils/translation";
import { useRouter } from "next/navigation";

const BlogCard = ({ blog }) => {
  const router = useRouter();
  const handleViewMore = async (slug) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="flex flex-col p-4 gap-6 border rounded-lg">
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
          <p>Sep 28, 2025</p>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="font-bold text-xl ">{blog?.title}</h2>
            <h4
              className="blog-card-description"
              dangerouslySetInnerHTML={{
                __html:
                  blog?.description?.length > 100
                    ? blog.description.slice(0, 100) + "..."
                    : blog?.description,
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
