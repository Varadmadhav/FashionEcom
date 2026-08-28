import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route for placing an order
router.post("/", createOrder);

// Protected Admin routes
router.get("/", authenticateAdmin, getOrders);
router.put("/:id/status", authenticateAdmin, updateOrderStatus);

export default router;
