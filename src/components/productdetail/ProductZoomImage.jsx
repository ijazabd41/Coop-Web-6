import React from "react";
import ReactImageMagnify from "react-image-magnify";
import { useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";

const ProductZoomImage = ({ image }) => {
  const setting = useSelector((state) => state.Setting);
  const imageSrc = image || setting?.setting?.web_settings?.placeholder_image;

  return (
    <Card className="border-0 shadow-none h-full w-full">
      <CardContent className="p-2 h-full w-full">
        <div className="flex justify-center items-center h-full">
          <div className="w-full  h-full ">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Product Image",
                  isFluidWidth: true,
                  src: imageSrc,
                },
                largeImage: {
                  src: imageSrc,
                  width: 1000,
                  height: 1000,
                },
                style: {
                  height: "100%",
                  width: "100%",
                },
                imageClassName: "my-custom-image-class",
                enlargedImageContainerDimensions: {
                  width: "200%",
                  height: "150%",
                },
                enlargedImageContainerStyle: {
                  zIndex: 1000,
                  width: "300px",
                  height: "300px",
                  overflow: "hidden",
                  zIndex: 999,
                  backgroundColor: "#fff",
                  border: "none",
                },
                enlargedImagePosition: "beside",
                lensStyle: {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
                isHintEnabled: true,
                hintTextMouse: "Hover to zoom",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductZoomImage;
