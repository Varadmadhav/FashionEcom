import { Router } from "express";
import {
  getOrders,
  getCustomerOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticateCustomer } from "../middleware/customerAuth";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public / Customer routes
router.post("/", createOrder);
router.get("/my-orders", authenticateCustomer, getCustomerOrders);

// Admin routes & Order status update routes
router.get("/", authenticateAdmin, getOrders);
router.put("/:id/status", authenticateAdmin, updateOrderStatus);
router.put("/status/:id", authenticateAdmin, updateOrderStatus);
router.put("/:id", authenticateAdmin, updateOrderStatus);
router.put("/admin/:id/status", authenticateAdmin, updateOrderStatus);

export default router;
