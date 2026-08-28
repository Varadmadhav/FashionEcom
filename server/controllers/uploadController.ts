import { Request, Response } from "express";
import cloudinary, { isCloudinaryServerConfigured } from "../config/cloudinary";

/**
 * POST /api/upload
 * Accepts an image file (Multer memory buffer) or base64 URL and uploads to Cloudinary
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { imageBase64 } = req.body;

    if (!file && !imageBase64) {
      res.status(400).json({
        success: false,
        message: "No image file or base64 data provided",
      });
      return;
    }

    if (!isCloudinaryServerConfigured()) {
      // If server API secret is missing but client preset exists, return warning/mock or fallback
      res.status(400).json({
        success: false,
        message:
          "Cloudinary credentials incomplete on server. Please add CLOUDINARY_API_SECRET to your .env file.",
      });
      return;
    }

    // 1. Upload Base64 string
    if (imageBase64) {
      const result = await cloudinary.uploader.upload(imageBase64, {
        folder: "fashion_ecom",
        use_filename: true,
        unique_filename: true,
      });

      res.status(200).json({
        success: true,
        message: "Image uploaded to Cloudinary successfully",
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      });
      return;
    }

    // 2. Upload Multer Buffer Stream
    if (file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fashion_ecom",
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            res.status(500).json({
              success: false,
              message: error?.message || "Cloudinary stream upload failed",
            });
            return;
          }

          res.status(200).json({
            success: true,
            message: "Image uploaded to Cloudinary successfully",
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
          });
        }
      );

      uploadStream.end(file.buffer);
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image",
    });
  }
};
