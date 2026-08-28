import { Request, Response } from "express";
import cloudinary, { isCloudinaryServerConfigured } from "../config/cloudinary";

/**
 * POST /api/upload
 * Accepts an image or video file (Multer memory buffer) or base64 data and uploads to Cloudinary.
 * If Cloudinary API credentials fail, safely returns a local Data URL fallback with 200 OK.
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { imageBase64 } = req.body;

    if (!file && !imageBase64) {
      res.status(400).json({
        success: false,
        message: "No image/video file or base64 data provided",
      });
      return;
    }

    if (!isCloudinaryServerConfigured()) {
      if (file) {
        const mimeType = file.mimetype || "image/jpeg";
        const base64Data = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
        res.status(200).json({
          success: true,
          message: "Uploaded using local fallback (Cloudinary not configured)",
          url: base64Data,
          fallback: true,
        });
        return;
      }
    }

    // 1. Upload Base64 string (Images & Videos)
    if (imageBase64) {
      try {
        const result = await cloudinary.uploader.upload(imageBase64, {
          folder: "fashion_ecom",
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
        });

        res.status(200).json({
          success: true,
          message: "File uploaded to Cloudinary successfully",
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          resource_type: result.resource_type,
        });
        return;
      } catch (cldErr: any) {
        console.warn("Cloudinary base64 upload fallback:", cldErr?.message);
        res.status(200).json({
          success: true,
          message: "Uploaded using local fallback",
          url: imageBase64,
          fallback: true,
        });
        return;
      }
    }

    // 2. Upload Multer Buffer Stream (Images & Videos)
    if (file) {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "fashion_ecom",
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) {
              console.warn("Cloudinary stream upload fallback:", error?.message);
              const mimeType = file.mimetype || "image/jpeg";
              const base64Data = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
              res.status(200).json({
                success: true,
                message: "Uploaded using local fallback",
                url: base64Data,
                fallback: true,
              });
              return;
            }

            res.status(200).json({
              success: true,
              message: "File uploaded to Cloudinary successfully",
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              resource_type: result.resource_type,
            });
          }
        );

        uploadStream.end(file.buffer);
      } catch (streamErr: any) {
        console.warn("Cloudinary stream exception fallback:", streamErr?.message);
        const mimeType = file.mimetype || "image/jpeg";
        const base64Data = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
        res.status(200).json({
          success: true,
          message: "Uploaded using local fallback",
          url: base64Data,
          fallback: true,
        });
      }
    }
  } catch (error: any) {
    console.error("Cloudinary upload catch error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
};
