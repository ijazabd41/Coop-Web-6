"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import BlogsCategories from "./BlogsCategories";
import RecentBlogs from "./RecentBlogs";
import * as api from "@/api/apiRoutes";
import BlogSkeleton, { BlogCardSkeleton } from "./BlogsSkeleton";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogsCategories, setBlogCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mostViewedBlogs, setMostViewedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(false);

  useEffect(() => {
    handleFetchBlogsCategoris();
    getMostViewedBlogs();
  }, []);

  useEffect(() => {
    handleFetchBlogs();
  }, [selectedCategory]);

  const handleFetchBlogs = async () => {
    setBlogsLoading(true);
    try {
      const blogs = await api.getBlogs({ categoryId: selectedCategory });
      setBlogs(blogs?.data);
      setBlogsLoading(false);
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
    <div className="container my-12">
      <div className="grid md:grid-cols-12 gap-6 grid-cols-1">
        <div className="md:col-span-8 col-span-12  grid md:grid-cols-2 grid-cols-1 gap-6">
          {blogsLoading
            ? Array.from({ length: 3 })?.map((_, i) => {
                return <BlogCardSkeleton key={i} />;
              })
            : blogs?.map((blog, i) => <BlogCard key={i} blog={blog} />)}
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          <BlogsCategories
            blogsCategories={blogsCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <RecentBlogs mostViewedBlogs={mostViewedBlogs} />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
