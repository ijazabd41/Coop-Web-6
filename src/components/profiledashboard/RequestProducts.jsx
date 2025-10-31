import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import * as api from "@/api/apiRoutes";
import RequestProductCard from "./requestedProduct/RequestProductCard";
import RequestedProductModal from "./requestedProduct/RequestedProductModal";
import { set } from "lodash";
import CardSkeleton from "../skeleton/CardSkeleton";

const RequestProducts = () => {
  const [requestedProducts, setRequestedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(false);

  const REQUEST_LIMIT = 9;

  useEffect(() => {
    getRequestedProducts(false);
  }, []);

  const getRequestedProducts = async (isFetchMore) => {
    setLoading(true);
    try {
      const response = await api.getRequestedProducts({
        limit: REQUEST_LIMIT,
        offset: offset,
      });
      setTotalRequests(response.total);
      if (isFetchMore) {
        setRequestedProducts((prevRequests) => [
          ...prevRequests,
          ...response.data,
        ]);
        setOffset((offset) => offset + REQUEST_LIMIT);
        setLoading(false);
      } else {
        setRequestedProducts(response.data);
        setOffset((offset) => offset + REQUEST_LIMIT);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  return (
    <div className="w-full mx-auto h-fit border-2 rounded-lg">
      <div className="w-full backgroundColor flex justify-between items-center">
        <h2 className=" text-base md:text-2xl font-semibold p-4">
          {t("requestedProducts")}
        </h2>
        <button
          className="primaryBackColor text-white px-4 py-2 rounded-md m-4"
          onClick={() => setShowModal(true)}
        >
          {t("requestNewProduct")}
        </button>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-12 md:m-4">
          {loading ? (
            Array?.from({ length: 6 })?.map((_, index) => {
              return (
                <div
                  className="col-span-12  md:col-span-6 lg:col-span-4"
                  key={index}
                >
                  <CardSkeleton height={200} padding="2px" key={index} />
                </div>
              );
            })
          ) : requestedProducts.length > 0 ? (
            requestedProducts.map((request) => (
              <div className="col-span-12  md:col-span-6 lg:col-span-4 flex ">
                <RequestProductCard key={request.id} request={request} />
              </div>
            ))
          ) : (
            <p className="textColor text-center w-full text-3xl col-span-12">
              {t("noRequestedProducts")}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          {totalRequests > requestedProducts.length && (
            <button
              className="bg-[#29363f] rounded-md text-white text-base font-medium gap-1 p-1.5 px-3 my-2"
              onClick={() => getRequestedProducts(true)}
            >
              {t("load_more")}
            </button>
          )}
        </div>
      </div>

      <RequestedProductModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default RequestProducts;
