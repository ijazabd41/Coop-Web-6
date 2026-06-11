import React from "react";
import * as api from "@/api/apiRoutes";
import { useSelector } from "react-redux";
import VerticleProductCard from "../productcards/VerticleProductCard";
import { t } from "@/utils/translation";
import CardSkeleton from "../skeleton/CardSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";

const HomeAllProducts = () => {
  const city = useSelector((state) => state.City.city);
  const setting = useSelector((state) => state.Setting.setting);

  const totalProductsPerPage = 12;

  const latitude = city?.latitude || setting?.default_city?.latitude;
  const longitude = city?.longitude || setting?.default_city?.longitude;
  const language = useSelector((state) => state.Language.selectedLanguage);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["home-all-products", latitude, longitude,language?.id],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.getProductByFilter({
        latitude,
        longitude,
        filters: {
          limit: totalProductsPerPage,
          offset: pageParam,
        },
      });
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * totalProductsPerPage;
      return lastPage.status === 1 && nextOffset < lastPage.total
        ? nextOffset
        : undefined;
    },
    enabled: !!(latitude && longitude),
  });

  const allProducts = data?.pages?.flatMap((page) => page.data) || [];

  const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);

  if (isLoading && !data) {
    return (
      <section>
        <div className="py-6 md:py-10 container px-4 md:px-6">
          <div className="flex flex-col gap-3">
            <h2 className="textColor text-xl sm:text-3xl font-extrabold leading-[29px] m-0">
              {t("allProducts")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-2">
              {placeholderItems.map((index) => (
                <div
                  key={index}
                  className="col-span-1"
                >
                  <CardSkeleton height={300} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return allProducts.length > 0 ? (
    <section>
      <div className="py-6 md:py-10 container px-4 md:px-6">
        <div className="flex flex-col gap-3">
          <h2 className="textColor text-xl sm:text-3xl font-extrabold leading-[29px] m-0">
            {t("allProducts")}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-2">
            {allProducts.map((product) => (
              <div
                key={product?.id}
                className="col-span-1"
              >
                <VerticleProductCard product={product} />
              </div>
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-2 mt-2">
              {placeholderItems.map((index) => (
                <div
                  key={index}
                  className="col-span-1"
                >
                  <CardSkeleton height={300} />
                </div>
              ))}
            </div>
          )}

          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <button
                className="accentButtonBg rounded-md text-white text-base font-medium gap-1 p-1.5 px-3"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {t("load_more")}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  ) : (
    <></>
  );
};

export default HomeAllProducts;

