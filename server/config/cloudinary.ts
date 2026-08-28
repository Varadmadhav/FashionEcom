import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.VITE_CLOUDINARY_CLOUD_NAME ||
  "";

const apiKey =
  process.env.CLOUDINARY_API_KEY ||
  process.env.VITE_CLOUDINARY_API_KEY ||
  "";

const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

export const isCloudinaryServerConfigured = (): boolean => {
  return (
    Boolean(cloudName) &&
    cloudName !== "your_cloud_name_here" &&
    Boolean(apiKey) &&
    apiKey !== "your_api_key_here" &&
    Boolean(apiSecret) &&
    apiSecret !== "your_api_secret_here"
  );
};

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
