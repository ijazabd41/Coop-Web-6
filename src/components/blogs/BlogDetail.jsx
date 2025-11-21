import React, { useState, useEffect } from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { t } from "@/utils/translation";
import { useRouter } from "next/router";
import * as api from "@/api/apiRoutes";
import { formatCustomDate } from "@/lib/utils";
import Loader from "../loader/Loader";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import RecentBlogsSwiper from "./RecentBlogsSwiper";

const BlogDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    if (!slug) return;
    handleFetchBlog();
  }, [slug]);

  const handleFetchBlog = async () => {
    setLoading(true);
    try {
      const blog = await api.getBlogs({ slug: slug });
      setBlog(blog?.data?.[0]);
      handleSetBlogCount(blog?.data?.[0]);
      handleFetchBlogs(blog?.data?.[0]?.id);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleFetchBlogs = async (blogId) => {
    try {
      const blogs = await api.getBlogs({
        offset: 0,
        limit: 10,
      });
      const filteredBlogs = blogs?.data?.filter((blog) => blog.id !== blogId);
      setRecentBlogs(filteredBlogs);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSetBlogCount = async (blogData) => {
    try {
      const views = await api.setBlogCount({ blogId: blogData?.id });
    } catch (error) {
      console.log("error", error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <BreadCrumb />
      <div className="">
        <div className="backgroundColor border-t-2">
          <div className="container flex flex-col gap-6 py-10">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-2xl">{blog?.title}</h1>
              <p className="font-medium !text-start blog-description">
                {blog?.short_description}
              </p>
            </div>
            <div>
              <ImageWithPlaceholder
                className={"h-full w-full rounded-md "}
                src={blog?.image_url}
                alt={blog?.title}
              />
            </div>
            <div className="p-3 flex flex-col md:flex-row  gap-2 md:gap-10 bodyBackgroundColor rounded-lg">
              <div className="flex flex-col ">
                <p className="subTextColor">{t("categories")}</p>
                <h4 className="font-bold">{blog?.category?.name}</h4>
              </div>
              <div className="border h-12 hidden md:block"></div>
              <div className="flex flex-col ">
                <p className="subTextColor">{t("published_date")}</p>
                <h4 className="font-bold">
                  {formatCustomDate(blog?.created_at)}
                </h4>
              </div>
              <div className="border h-12 hidden md:block"></div>
              <div className="flex flex-col ">
                <p className="subTextColor">{t("read_time")}</p>
                <h4 className="font-bold">{`${blog?.read_time} ${t(
                  "minutes"
                )}`}</h4>
              </div>
            </div>
          </div>
        </div>
        <div
          className="container py-12 !text-start"
          dangerouslySetInnerHTML={{ __html: blog?.description }}
        ></div>
      </div>
      <RecentBlogsSwiper recentBlogs={recentBlogs} />
    </>
  );
};

export default BlogDetail;
