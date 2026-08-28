import React, { useState, useEffect } from "react";
import { getCloudinaryUrl, CloudinaryTransformOptions } from "@/utils/cloudinary";

export interface CloudinaryImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  crop?: CloudinaryTransformOptions["crop"];
  quality?: CloudinaryTransformOptions["quality"];
  format?: CloudinaryTransformOptions["format"];
  gravity?: CloudinaryTransformOptions["gravity"];
}

/**
 * Reusable Image component that processes image sources via Cloudinary CDN.
 * Includes automatic onError fallback to original URL if CDN fetch fails.
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
  const optimizedSrc = getCloudinaryUrl(src, {
    width,
    height,
    crop,
    quality,
    format,
    gravity,
  });

  const [imgSrc, setImgSrc] = useState<string>(optimizedSrc);

  useEffect(() => {
    setImgSrc(optimizedSrc);
  }, [src, optimizedSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (imgSrc !== src) {
      // Fallback to original raw src if Cloudinary URL fails
      setImgSrc(src);
    }
    if (onError) {
      onError(e);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || ""}
      className={className}
      loading={loading}
      onError={handleError}
      {...restProps}
    />
  );
};

export default CloudinaryImage;
