import { Router } from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Protected Admin routes
router.post("/", authenticateAdmin, createProduct);
router.put("/:id", authenticateAdmin, updateProduct);
router.delete("/:id", authenticateAdmin, deleteProduct);

export default router;
