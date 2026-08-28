import { Router } from "express";
import { uploadImage } from "../controllers/uploadController";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const router = Router();

// Upload image to Cloudinary (accepts 'image' file field or base64 payload)
router.post("/", uploadMiddleware.single("image"), uploadImage);

export default router;
