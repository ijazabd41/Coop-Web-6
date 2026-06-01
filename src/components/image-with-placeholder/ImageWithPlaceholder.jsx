"use client";
import React, { useEffect, useState, memo } from "react";
import Image from "next/image";
import ImagePlaceholder from "../../assets/image-placeholder/image.png";
import { useSelector } from "react-redux";
import { imageUrl } from "@/api/odoo/utils";

const SEO_UNOPTIMIZED = process.env.NEXT_PUBLIC_SEO === "false";

function resolveProductImageSrc(src) {
  if (!src || typeof src !== "string") return "";
  if (
    src.startsWith("data:") ||
    src.startsWith("/api/odoo/") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src.startsWith("/api/odoo/web/image/")
      ? imageUrl(src)
      : src;
  }
  return imageUrl(src);
}

function isUrlImageSrc(src) {
  if (typeof src !== "string" || !src) return false;
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("data:")
  );
}

const ImageWithPlaceholder = ({
  src,
  alt,
  className,
  handleOnClick,
  priority,
  width,
  height,
  sizes = "(max-width: 768px) 50vw, 25vw",
}) => {
  const setting = useSelector((state) => state.Setting?.setting);
  const resolvedSrc = resolveProductImageSrc(src);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [resolvedSrc]);

  const placeholder =
    setting?.web_settings?.placeholder_image ||
    setting?.web_settings?.web_logo ||
    ImagePlaceholder;

  if (resolvedSrc && isUrlImageSrc(resolvedSrc) && !isError) {
    const dimProps =
      width && height
        ? { width, height }
        : { fill: true, sizes };

    return (
      <Image
        src={resolvedSrc}
        alt={alt || "Product image"}
        className={className}
        onClick={handleOnClick}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        unoptimized={SEO_UNOPTIMIZED}
        {...dimProps}
        style={
          width && height
            ? { objectFit: "cover" }
            : { objectFit: "cover", width: "100%", height: "100%" }
        }
        onError={() => setIsError(true)}
      />
    );
  }

  const displaySrc = !resolvedSrc || isError ? placeholder : resolvedSrc;

  return (
    <Image
      src={displaySrc}
      unoptimized
      alt={alt || "Product image"}
      {...(width && height
        ? { width, height }
        : { fill: true, sizes: "100vw" })}
      priority={priority}
      className={className}
      onClick={handleOnClick}
      onError={() => setIsError(true)}
    />
  );
};

export default memo(ImageWithPlaceholder);
