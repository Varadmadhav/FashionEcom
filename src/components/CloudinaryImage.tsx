import React, { useState, useEffect } from "react";
import { getCloudinaryUrl, CloudinaryTransformOptions } from "@/utils/cloudinary";

export interface CloudinaryImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  width?: number;
  height?: number;
  crop?: CloudinaryTransformOptions["crop"];
  quality?: CloudinaryTransformOptions["quality"];
  format?: CloudinaryTransformOptions["format"];
  gravity?: CloudinaryTransformOptions["gravity"];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80";

/**
 * Reusable Image component that processes image sources via Cloudinary CDN.
 * Prevents empty src attribute errors and handles image error fallbacks cleanly.
 */
export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  width,
  height,
  crop,
  quality = "auto",
  format = "auto",
  gravity,
  alt,
  className,
  loading = "lazy",
  onError,
  ...restProps
}) => {
  const safeSrc = src && typeof src === "string" && src.trim() !== "" ? src : FALLBACK_IMAGE;

  const optimizedSrc = getCloudinaryUrl(safeSrc, {
    width,
    height,
    crop,
    quality,
    format,
    gravity,
  });

  const [imgSrc, setImgSrc] = useState<string>(optimizedSrc || FALLBACK_IMAGE);

  useEffect(() => {
    setImgSrc(optimizedSrc || FALLBACK_IMAGE);
  }, [src, optimizedSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgSrc !== safeSrc) {
      setImgSrc(safeSrc);
    } else {
      setImgSrc(FALLBACK_IMAGE);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={imgSrc || FALLBACK_IMAGE}
      alt={alt || "Product image"}
      className={className}
      loading={loading}
      onError={handleError}
      {...restProps}
    />
  );
};

export default CloudinaryImage;
