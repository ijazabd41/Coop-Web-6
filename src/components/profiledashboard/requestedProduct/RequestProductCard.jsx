import ImageWithPlaceholder from "@/components/image-with-placeholder/ImageWithPlaceholder";
import { t } from "@/utils/translation";
import React from "react";

const RequestProductCard = ({ request }) => {
  return (
    <div className="flex flex-col p-2 border rounded-md w-full  min-h-48 m-2">
      <div>
        <div className="relative">
          <div className="absolute top-2 left-2">
            <span
              className={`${
                request?.status == "pending"
                  ? "bg-yellow-400"
                  : request?.status == "rejected"
                  ? "bg-red-400"
                  : "bg-green-400"
              } text-white  px-2 py-1 rounded`}
            >
              {request?.status}
            </span>
          </div>
          {request?.image_url && (
            <ImageWithPlaceholder
              src={request.image_url}
              alt="Requested product image"
              className={"w-full h-48 rounded-md object-cover"}
            />
          )}
        </div>
      </div>
      {request?.description && (
        <p
          className={`text-sm textColor ${
            request?.image_url ? "mt-2" : "mt-10"
          } p-2`}
        >
          {request?.description}
        </p>
      )}

      {request?.admin_notes && (
        <div className="p-2">
          <h3 className="font-semibold mb-2">{t("rejectedReason")}</h3>
          <p className="text-sm textColor">{request?.admin_notes}</p>
        </div>
      )}
    </div>
  );
};

export default RequestProductCard;
