import React, { useEffect, useState } from "react";
import * as api from "@/api/apiRoutes";
import { useSelector } from "react-redux";
import VerticleProductCard from "../productcards/VerticleProductCard";
import { t } from "@/utils/translation";
import CardSkeleton from "../skeleton/CardSkeleton";

const HomeAllProducts = () => {
  const city = useSelector((state) => state.City.city);
  const setting = useSelector((state) => state.Setting.setting);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loadmoreLoading, setLoadmoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const totalProductsPerPage = 12;

  useEffect(() => {
    setAllProducts([]);
    setOffset(0);
    setHasMore(true);
    handleFetchProduct(false);
  }, [city]);

  const handleFetchProduct = async (isFetchMore = false) => {
    let localOffset = 0;

    if (isFetchMore) {
      setLoadmoreLoading(true);
      localOffset = offset + totalProductsPerPage;
    } else {
      setLoading(true);
      localOffset = 0;
    }

    const latitude = city?.latitude || setting?.default_city?.latitude;
    const longitude = city?.longitude || setting?.default_city?.longitude;

    try {
      if (latitude && longitude) {
        const response = await api.getProductByFilter({
          latitude,
          longitude,
          filters: {
            limit: totalProductsPerPage,
            offset: localOffset,
          },
        });

        if (response.status === 1) {
          setTotalProducts(response.total);
          setOffset(localOffset);

          setAllProducts((prev) =>
            isFetchMore ? [...prev, ...response.data] : response.data
          );

          setHasMore(localOffset + response.data.length < response.total);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.log("Error", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadmoreLoading(false);
    }
  };

  const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);

  return allProducts?.length > 0 ? (
    <section>
      <div className="py-3 md:py-6 container px-2">
        <div className="flex flex-col gap-3">
          <h2 className="textColor text-xl sm:text-3xl font-extrabold leading-[29px] m-0">
            {t("allProducts")}
          </h2>

          <div className="grid grid-cols-12 gap-2">
            {loading
              ? placeholderItems.map((index) => (
                <div
                  key={index}
                  className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2"
                >
                  <CardSkeleton height={300} />
                </div>
              ))
              : allProducts.map((product) => (
                <div
                  key={product?.id}
                  className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3 2xl:col-span-2"
                >
                  <VerticleProductCard product={product} />
                </div>
              ))}
          </div>

          {loadmoreLoading && (
            <div className="grid grid-cols-12 gap-2 mt-2">
              {placeholderItems.map((index) => (
                <div
                  key={index}
                  className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2"
                >
                  <CardSkeleton height={300} />
                </div>
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <div className="flex justify-center mt-4">
              <button
                className="bg-[#29363f] rounded-md text-white text-base font-medium gap-1 p-1.5 px-3"
                onClick={() => handleFetchProduct(true)}
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
