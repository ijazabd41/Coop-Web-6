import React from "react";
import { t } from "@/utils/translation";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useRouter } from "next/navigation";

const RecentBlogs = ({ mostViewedBlogs }) => {
  const router = useRouter();

  const handleBlogNavigation = (slug) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div className="flex flex-col p-4 gap-6 border rounded-lg backgroundColor">
      <h2 className="font-bold  text-xl underline">{t("topViewedBlogs")}</h2>
      <div className="flex flex-col gap-6">
        {mostViewedBlogs?.map((blog) => {
          return (
            <div
              className="flex p-2 gap-2 headerBackgroundColor cursor-pointer rounded-lg"
              onClick={() => handleBlogNavigation(blog?.slug)}
              key={blog?.id}
            >
              <ImageWithPlaceholder
                className={"rounded-md h-16 w-20 md:h-24 md:w-32"}
                src={blog?.image_url}
              />
              <div className="flex flex-col gap-2 overflow-hidden">
                <p className="text-sm font-normal">
                  {blog?.title?.slice(0, 20)}
                </p>
                <h2
                  className="font-bold text-base blog-card-description"
                  dangerouslySetInnerHTML={{
                    __html:
                      blog?.description?.length > 25
                        ? blog.description.slice(0, 25) + "..."
                        : blog?.description,
                  }}
                ></h2>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentBlogs;
