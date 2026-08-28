import { Router } from "express";
import {
  registerCustomer,
  loginCustomer,
  forgotPassword,
  getCustomerProfile,
  getCustomerCart,
  updateCustomerCart,
  getAdminCustomers,
  toggleCustomerStatus,
  deleteCustomer,
} from "../controllers/customerController";
import { authenticateCustomer } from "../middleware/customerAuth";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public Customer Auth Endpoints
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/forgot-password", forgotPassword);

// Protected Customer Profile & Cart Endpoints
router.get("/me", authenticateCustomer, getCustomerProfile);
router.get("/cart", authenticateCustomer, getCustomerCart);
router.post("/cart", authenticateCustomer, updateCustomerCart);

// Admin Customer Management Endpoints
router.get("/admin/list", authenticateAdmin, getAdminCustomers);
router.put("/admin/:id/status", authenticateAdmin, toggleCustomerStatus);
router.delete("/admin/:id", authenticateAdmin, deleteCustomer);

export default router;
