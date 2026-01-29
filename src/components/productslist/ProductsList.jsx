import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import { t } from "@/utils/translation";
import Filter from "../productFilter/ProductFilter";
import * as api from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import ListViewProductCard from "../productcards/ListViewProductCard";
import VerticleProductCard from "../productcards/VerticleProductCard";
import CardSkeleton from "../skeleton/CardSkeleton";
import FilterDrawer from "../productFilter/FilterDrawer";
import { IoFilter } from "react-icons/io5";
import {
  setFilterSort,
  setFilterView,
} from "@/redux/slices/productFilterSlice";
import NoOrderSvg from "@/assets/not_found_images/No_Orders.svg";
import Image from "next/image";

const Products = () => {
  const dispatch = useDispatch();
  const city = useSelector((state) => state.City);

  const filter = useSelector((state) => state.ProductFilter);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [values, setValues] = useState([]);
  const [isLoader, setisLoader] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const total_products_per_page = 12;

  const fetchProducts = async ({ pageParam = 0 }) => {
    const filterParams = {
      min_price: filter.price_filter?.min_price,
      max_price: filter.price_filter?.max_price,
      category_ids:
        filter?.category_id == "NaN" || filter?.category_id == "all categories"
          ? null
          : filter?.category_id,
      brand_ids: filter?.brand_ids.toString(),
      sort: filter?.sort_filter,
      search: filter?.search,
      limit: total_products_per_page,
      sizes: filter?.search_sizes
        ?.filter((obj) => obj.checked)
        .map((obj) => obj["size"])
        .join(","),
      offset: pageParam,
      unit_ids: filter?.search_sizes
        ?.filter((obj) => obj.checked)
        .map((obj) => obj["unit_id"])
        .join(","),
      seller_id: filter?.seller_id,
      country_id: filter?.country_id,
      section_id: filter?.section_id,
    };

    return await api.getProductByFilter({
      latitude: city.city.latitude,
      longitude: city.city.longitude,
      filters: filterParams,
    });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", filter, city.city.latitude, city.city.longitude],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < total_products_per_page) {
        return undefined;
      }
      return allPages.length * total_products_per_page;
    },
    initialPageParam: 0,
  });

  const productResult = data?.pages?.flatMap((page) => page.data) || [];
  const totalProducts = data?.pages?.[0]?.total || 0;
  const loading = isLoading;
  const isLoadMoreLoading = isFetchingNextPage;

  // Dummy setters for Filter component
  const setProductResult = () => { };
  const setOffset = () => { };

  useEffect(() => {
    if (data?.pages?.[0]) {
      handlePrices(data.pages[0]);
    }
  }, [data]);

  const handlePrices = async (result) => {
    if (
      filter?.price_filter?.min_price !== undefined &&
      filter?.price_filter?.min_price !== null &&
      filter?.price_filter?.max_price !== null &&
      filter?.price_filter?.max_price !== undefined
    ) {
      setValues([
        parseInt(filter?.price_filter?.min_price),
        parseInt(filter?.price_filter?.max_price),
      ]);
      setMinPrice(parseInt(result.total_min_price));
      setMaxPrice(parseInt(result.total_max_price));
    } else {
      setMinPrice(parseInt(result.total_min_price));
      if (result.total_min_price === result.total_max_price) {
        setMaxPrice(parseInt(result.total_max_price) + 100);
        setValues([
          parseInt(result.total_min_price),
          parseInt(result.total_max_price) + 100,
        ]);
      } else {
        setMaxPrice(parseInt(result.total_max_price));
        setValues([
          parseInt(result.total_min_price),
          parseInt(result.total_max_price),
        ]);
      }
    }
  };
  const handleGridViewChange = () => {
    setIsGridView(true);
    dispatch(setFilterView({ data: true }));
  };
  const handleListViewChange = () => {
    setIsGridView(false);
    dispatch(setFilterView({ data: false }));
  };

  const handleFetchMore = async () => {
    fetchNextPage();
  };

  const sortProduct = async (value) => {
    dispatch(setFilterSort({ data: value }));
  };

  const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);

  return (
    <section>
      <div>
        <div>
          <BreadCrumb />
        </div>
        <div className="container px-2">
          <div
            className="w-full cardBorder md:hidden flex p-3 mt-4 rounded-sm gap-2 items-center text-xl font-bold hover:cursor-pointer"
            onClick={() => setShowFilter(true)}
          >
            <IoFilter />
            {t("filter")}
          </div>
          <div className="my-8 grid grid-cols-12 gap-6">
            <div className=" col-span-3 rounded-sm hidden md:block ">
              <Filter
                setProductResult={setProductResult}
                setOffset={setOffset}
                handlePrices={handlePrices}
                minPrice={minPrice}
                maxPrice={maxPrice}
                values={values}
                setValues={setValues}
                setMaxPrice={setMaxPrice}
                setMinPrice={setMinPrice}
                setisLoader={setisLoader}
              />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="flex flex-col gap-6">
                {loading ? (
                  <CardSkeleton height={70} />
                ) : (
                  <div className="flex justify-between flex-col md:flex-row  md:items-center p-4 cardBorder rounded-md gap-1 md:gap-0  headerBackgroundColor">
                    <p className="text-dm font-normal order-2 md:order-1">
                      {totalProducts} {t("products_found")}
                    </p>
                    <div className="flex justify-between gap-3 order-1 md:order-2 ">
                      <div className="flex  gap-2 items-center">
                        <p className="text-sm text-nowrap font-normal">
                          {t("sortBy")}
                        </p>
                        <Select
                          onValueChange={sortProduct}
                          value={filter?.sort_filter}
                        >
                          <SelectTrigger className="w-[120px] md:w-[150px] lg:w-[200px] h-full buttonBackground border-none">
                            <SelectValue placeholder={t("default")} />
                          </SelectTrigger>
                          <SelectContent className="w-[120px] md:w-[150px] lg:w-[200px] h-full z-10  hidden md:block lg:block">
                            <SelectItem value="default">
                              {t("default")}
                            </SelectItem>
                            <SelectItem value="new">
                              {t("newest_first")}
                            </SelectItem>
                            <SelectItem value="old">
                              {t("oldest_first")}
                            </SelectItem>
                            <SelectItem value="high">
                              {t("high_to_low")}
                            </SelectItem>
                            <SelectItem value="low">
                              {t("low_to_high")}
                            </SelectItem>
                            <SelectItem value="discount">
                              {t("discount_high_to_low")}
                            </SelectItem>
                            <SelectItem value="popular">
                              {t("popularity")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex  gap-4 items-center">
                        <span
                          className={`${filter?.grid_view
                            ? "primaryBackColor rounded-md text-white p-1.5"
                            : ""
                            } hover:cursor-pointer`}
                        >
                          <BsFillGrid3X3GapFill
                            size={23}
                            onClick={handleGridViewChange}
                          />
                        </span>
                        <span
                          className={`${!filter?.grid_view
                            ? "primaryBackColor rounded-md text-white  p-1.5"
                            : ""
                            } hover:cursor-pointer`}
                        >
                          <FaThList size={23} onClick={handleListViewChange} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-12 gap-2 h-full">
                  {loading ? (
                    placeholderItems.map((index) => {
                      return filter?.grid_view ? (
                        <div
                          className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3"
                          key={index}
                        >
                          <CardSkeleton height={300} />
                        </div>
                      ) : (
                        <div className="col-span-12">
                          <CardSkeleton height={200} />
                        </div>
                      );
                    })
                  ) : productResult?.length <= 0 ? (
                    <div className="flex flex-col justify-center items-center col-span-12">
                      <div className="h-3/4 w-3/4">
                        <Image
                          src={NoOrderSvg}
                          alt="Product not found"
                          width={320}
                          height={320}
                          className="h-full w-full"
                        />
                      </div>
                      <h2 className="font-bold text-2xl">
                        {t("no_products_found")}
                      </h2>
                    </div>
                  ) : (
                    productResult?.map((product) => {
                      return filter?.grid_view ? (
                        <div
                          className=" col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3 "
                          key={product?.id}
                        >
                          <VerticleProductCard product={product} />
                        </div>
                      ) : (
                        <div className="col-span-12" key={product?.id}>
                          <ListViewProductCard product={product} />
                        </div>
                      );
                    })
                  )}

                  {isLoadMoreLoading ? (
                    placeholderItems.map((index) => {
                      return filter?.grid_view ? (
                        <div
                          className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3"
                          key={index}
                        >
                          <CardSkeleton height={300} />
                        </div>
                      ) : (
                        <div className="col-span-12">
                          <CardSkeleton height={200} />
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <div className="col-span-12 mt-6 w-full flex justify-center mx-auto">
                    {totalProducts > productResult?.length ? (
                      <button
                        className="bg-[#29363f] rounded-md text-white text-base font-medium gap-1 p-1.5 px-3"
                        onClick={handleFetchMore}
                      >
                        {t("load_more")}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FilterDrawer
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        setProductResult={setProductResult}
        setOffset={setOffset}
        handlePrices={handlePrices}
        minPrice={minPrice}
        maxPrice={maxPrice}
        values={values}
        setValues={setValues}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
      />
    </section>
  );
};

export default Products;
