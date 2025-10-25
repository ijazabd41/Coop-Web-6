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
  }, []);

  const handleFetchBlogs = async () => {
    try {
      const blogs = await api.getBlogs();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleFetchBlogsCategoris = async () => {
    try {
      const blogsCategories = await api.getBlogsCategories(0, 10);
      setBlogCategories(blogsCategories?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="container my-12">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 grid grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <BlogCard key={i} />
          ))}
        </div>
        <div className="col-span-4 flex flex-col gap-6">
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
