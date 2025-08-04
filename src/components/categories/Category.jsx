import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import * as api from "@/api/apiRoutes";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterCategory,
  setSelectedCategories,
} from "@/redux/slices/productFilterSlice";
import CardSkeleton from "../skeleton/CardSkeleton";
import { t } from "@/utils/translation";

const Category = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { slug } = router.query;

  const selectedCategories = useSelector(
    (state) => state.ProductFilter?.selectedCategories
  );

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCategories, setTotalCategories] = useState(0);

  const [page, setPage] = useState(1);
  const categoryPerPage = 12;
  const slug_id = slug === "all" ? "" : slug;

  // Reset page when slug changes
  useEffect(() => {
    setPage(1);
  }, [slug_id]);

  useEffect(() => {
    const offset = (page - 1) * categoryPerPage;
    fetchCategories(slug_id, offset);
  }, [page, slug_id]);

  const fetchCategories = async (Slug = "", offset = 0) => {
    setIsLoading(true);
    try {
      const result = await api.getCategories({
        limit: categoryPerPage,
        offset,
        slug: Slug,
      });

      setCategories(result);
      setTotalCategories(result?.total || 0);
    } catch (error) {
      console.log("Error", error);
    }
    setIsLoading(false);
  };

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategories({ data: category?.id }));

    if (category?.has_child) {
      router.push(`/categories/${category?.slug}`);
    } else {
      const cats = [...selectedCategories, category?.id];
      dispatch(setFilterCategory({ data: cats.join(",") }));
      router.push(`/products`);
    }
  };

  const totalPages = Math.ceil(totalCategories / categoryPerPage);

  return (
    <section>
      <BreadCrumb />
      <div className="container">
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto my-5 px-2`}
        >
          {isLoading
            ? Array.from({ length: categoryPerPage }).map((_, index) => (
                <div key={index} className="col-span-1">
                  <CardSkeleton height={180} />
                </div>
              ))
            : categories?.data?.map((category) => (
                <div
                  key={category?.id}
                  className="col-span-1"
                  onClick={() => handleCategoryClick(category)}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center my-6 gap-2 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                page === 1
                  ? "backgroundColor text-gray-500 cursor-not-allowed"
                  : "buttonBackground hover:backgroundColor textColor"
              }`}
            >
              {t("prev")}
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                    page === pageNumber
                      ? "primaryBackColor text-white primaryBorder"
                      : "backgroundColor textColor hover:backgroundColor"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                setPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 ${
                page === totalPages
                  ? "backgroundColor text-gray-500 cursor-not-allowed"
                  : "backgroundColor hover:backgroundColor textColor"
              }`}
            >
              {t("next")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
