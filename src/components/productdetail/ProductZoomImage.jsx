import { useRef } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import { Gallery, Item } from "react-photoswipe-gallery";
import "react-inner-image-zoom/lib/styles.min.css";
import "photoswipe/dist/photoswipe.css";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";

const ProductZoomImage = ({ image }) => {
  const buttonRef = useRef(null);

  const handleOpenLightbox = () => {
    if (buttonRef.current) {
      buttonRef.current.click();
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-2">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <InnerImageZoom
            src={image || "/assets/images/Durga.png"}
            zoomSrc={image || "/assets/images/Durga.png"}
            zoomType="hover"
            // imgAttributes={{
            //   alt: data?.heading || "Product image",
            //   title: data?.heading || "Product image",
            // }}
            className="custom-inner-image-zoom"
          />

          <Button
            aria-label="Open full image zoom"
            onClick={handleOpenLightbox}
            className="absolute bottom-0 right-0 bg-transparent px-4 py-2 text-black shadow-none hover:bg-transparent"
          >
            {/* <Image
              src="/assets/images/Zoom-Icons.png"
              alt="Open full image zoom"
              width={0}
              height={0}
              className="h-[20px] w-[20px] object-contain"
            /> */}
          </Button>

          <Gallery>
            <Item
              original={image || "/assets/images/Durga.png"}
              thumbnail=""
              width=""
              height=""
            >
              {({ ref, open }) => (
                <button
                  aria-label="Zoom"
                  ref={(node) => {
                    ref(node);
                    buttonRef.current = node;
                  }}
                  onClick={open}
                  style={{ display: "none" }}
                />
              )}
            </Item>
          </Gallery>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductZoomImage;
