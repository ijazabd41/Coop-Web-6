"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import BlogsCategories from "./BlogsCategories";
import RecentBlogs from "./RecentBlogs";
import * as api from "@/api/apiRoutes";
import BlogSkeleton, { BlogCardSkeleton } from "./BlogsSkeleton";
import { t } from "@/utils/translation";
import BreadCrumb from "../breadcrumb/BreadCrumb";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogsCategories, setBlogCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mostViewedBlogs, setMostViewedBlogs] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(false);

  const BLOG_LIMIT = 10;

  useEffect(() => {
    handleFetchBlogsCategoris();
    getMostViewedBlogs();
  }, []);

  useEffect(() => {
    setOffset(0);
    handleFetchBlogs(false, 0);
  }, [selectedCategory]);

  const handleFetchBlogs = async (isFetchMore = false, customOffset) => {
    setBlogsLoading(true);
    try {
      const blogs = await api.getBlogs({
        offset: customOffset,
        limit: BLOG_LIMIT,
        categoryId: selectedCategory,
      });
      if (isFetchMore) {
        setBlogs((prev) => [...prev, ...blogs.data]);
        setOffset((prev) => prev + BLOG_LIMIT);
      } else {
        setBlogs(blogs?.data);
        setOffset((prev) => prev + BLOG_LIMIT);
      }
      setBlogsLoading(false);
      setTotalBlogs(blogs?.total);
    } catch (error) {
      setBlogsLoading(false);
      console.log("error", error);
    }
  };

  const handleFetchBlogsCategoris = async () => {
    setLoading(true);
    try {
      const blogsCategories = await api.getBlogsCategories(0, 10);
      setBlogCategories(blogsCategories?.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const getMostViewedBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.getMostViewedBlogs({ limit: 5 });
      setMostViewedBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  return loading ? (
    <BlogSkeleton />
  ) : (
    <>
      <BreadCrumb />
      <div className="container my-12">
        <div className="grid md:grid-cols-12 gap-6 grid-cols-1">
          <div className="md:col-span-8 col-span-12 flex flex-col gap-6">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              {blogsLoading
                ? Array?.from({ length: 3 })?.map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))
                : blogs?.map((blog, i) => <BlogCard key={i} blog={blog} />)}
            </div>

            {blogs?.length == 0 && (
              <div className="w-full flex justify-center md:mt-96">
                <h1 className="text-2xl font-bold">{t("noBlogFound")}</h1>
              </div>
            )}

            {blogs?.length < totalBlogs && (
              <div className="w-full flex justify-center mt-6">
                <button
                  className="bg-[#29363f] rounded-md text-white text-base font-medium gap-1 p-1.5 px-3"
                  onClick={() => handleFetchBlogs(true, offset)}
                >
                  {t("load_more")}
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-4 col-span-12 flex flex-col gap-6">
            <BlogsCategories
              blogsCategories={blogsCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
            <RecentBlogs mostViewedBlogs={mostViewedBlogs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
