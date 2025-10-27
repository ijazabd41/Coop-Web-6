"use client";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import BlogsCategories from "./BlogsCategories";
import RecentBlogs from "./RecentBlogs";
import * as api from "@/api/apiRoutes";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogsCategories, setBlogCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    handleFetchBlogsCategoris();
    handleFetchBlogs();
  }, []);

  const handleFetchBlogs = async () => {
    try {
      const blogs = await api.getBlogs(0, 10);
      setBlogs(blogs?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleFetchBlogsCategoris = async () => {
    try {
      const blogsCategories = await api.getBlogsCategories(0, 10);
      setBlogCategories(blogsCategories?.data);
      setSelectedCategory(blogsCategories?.data?.[0]);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container my-12">
      <div className="grid md:grid-cols-12 gap-6 grid-cols-1">
        <div className="md:col-span-8 col-span-12  grid md:grid-cols-2 grid-cols-1 gap-6">
          {blogs?.map((blog, i) => (
            <BlogCard key={i} blog={blog} />
          ))}
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          <BlogsCategories
            blogsCategories={blogsCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <RecentBlogs />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
