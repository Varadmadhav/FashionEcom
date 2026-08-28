/**
 * Cloudinary Helper & Utility Module for FashionEcom
 * Handles CDN image URL optimization, fetch transformations, and direct unsigned uploads.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale" | "pad";
  quality?: "auto" | "auto:good" | "auto:best" | "auto:eco" | number;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
  gravity?: "auto" | "face" | "center";
}

export const getCloudinaryCloudName = (): string => {
  const env = (import.meta as any).env || {};
  return (env.VITE_CLOUDINARY_CLOUD_NAME || "").trim();
};

export const getCloudinaryUploadPreset = (): string => {
  const env = (import.meta as any).env || {};
  return (env.VITE_CLOUDINARY_UPLOAD_PRESET || "").trim();
};

/**
 * Checks whether Cloudinary credentials have been provided by the user in .env
 */
export const isCloudinaryConfigured = (): boolean => {
  const cloudName = getCloudinaryCloudName();
  return (
    Boolean(cloudName) &&
    cloudName !== "your_cloud_name_here" &&
    cloudName !== "your_cloud_name"
  );
};

/**
 * Generates an optimized Cloudinary CDN URL for any image source (local path, Unsplash URL, or Cloudinary URL).
 * If Cloudinary is not configured in .env, seamlessly returns the original source.
 */
export const getCloudinaryUrl = (
  src: string,
  options?: CloudinaryTransformOptions
): string => {
  if (!src || typeof src !== "string") return "";

  // 1. Data URLs, local relative assets (/hero-campaign-1.jpg), or unconfigured Cloudinary -> return original src
  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("/") ||
    src.includes("localhost") ||
    src.includes("127.0.0.1")
  ) {
    return src;
  }

  if (!isCloudinaryConfigured()) return src;

  const cloudName = getCloudinaryCloudName();

  // Construct transformation string (defaults: auto format, auto quality)
  const transforms: string[] = [];
  
  const format = options?.format || "auto";
  const quality = options?.quality || "auto";
  transforms.push(`f_${format}`);
  transforms.push(`q_${quality}`);

  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.crop) transforms.push(`c_${options.crop}`);
  if (options?.gravity) transforms.push(`g_${options.gravity}`);

  const transformString = transforms.join(",");

  // 2. If it's already a Cloudinary image URL
  if (src.includes("res.cloudinary.com")) {
    if (src.includes("/upload/")) {
      return src.replace("/upload/", `/upload/${transformString}/`);
    }
    if (src.includes("/fetch/")) {
      return src.replace("/fetch/", `/fetch/${transformString}/`);
    }
    return src;
  }

  // 3. Deliver remote image (e.g. Unsplash) through Cloudinary fetch API
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformString}/${encodeURIComponent(
    src
  )}`;
};

/**
 * Uploads a File or base64 data string to Cloudinary using Unsigned Upload Preset.
 * Returns the secure Cloudinary image URL.
 */
export const uploadToCloudinary = async (
  fileOrBase64: File | string
): Promise<string> => {
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getCloudinaryUploadPreset();

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Please paste your VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in the .env file."
    );
  }

  if (!uploadPreset || uploadPreset === "your_upload_preset_here") {
    throw new Error(
      "Cloudinary Upload Preset missing. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env file."
    );
  }

  const formData = new FormData();
  formData.append("file", fileOrBase64);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "fashion_ecom");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Cloudinary upload failed with status ${response.status}`
    );
  }

  const data = await response.json();
  return data.secure_url as string;
};
