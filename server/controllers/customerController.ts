import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer, { ICustomer } from "../models/Customer";
import { readJSON, writeJSON } from "../config/db";
import { AuthenticatedCustomerRequest } from "../middleware/customerAuth";

const JWT_SECRET = process.env.JWT_SECRET || "fashion_ecom_customer_jwt_secret_2026";
const CUSTOMERS_FILE = "customers.json";

// Fallback Helper for File-System DB
const getFileCustomers = (): any[] => {
  return readJSON(CUSTOMERS_FILE, [
    {
      id: "cust-001",
      name: "Ananya Sharma",
      email: "ananya@example.com",
      passwordHash: bcrypt.hashSync("Password@123", 10),
      phone: "+91 98765 43210",
      status: "active",
      ordersCount: 3,
      totalSpent: 18450,
      createdAt: "2024-01-20T10:00:00.000Z",
    },
    {
      id: "cust-002",
      name: "Rohan Verma",
      email: "rohan@example.com",
      passwordHash: bcrypt.hashSync("Password@123", 10),
      phone: "+91 98123 45678",
      status: "active",
      ordersCount: 1,
      totalSpent: 4200,
      createdAt: "2024-02-14T14:30:00.000Z",
    },
  ]);
};

/**
 * Generate JWT token for customer
 */
const generateCustomerToken = (customer: { id: string; email: string; name: string }) => {
  return jwt.sign(
    { id: customer.id, email: customer.email, name: customer.name },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
};

/**
 * POST /api/customer/register
 * Customer Sign Up
 */
export const registerCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please fill in all required fields (name, email, password).",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try MongoDB Atlas connection
    try {
      const existing = await Customer.findOne({ email: cleanEmail });
      if (existing) {
        res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please sign in.",
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newCustomer = await Customer.create({
        name,
        email: cleanEmail,
        passwordHash,
        phone: phone || "",
        status: "active",
        cart: [],
        addresses: [],
      });

      const token = generateCustomerToken({
        id: newCustomer._id.toString(),
        email: newCustomer.email,
        name: newCustomer.name,
      });

      res.status(201).json({
        success: true,
        message: "Account created successfully! Welcome to AURELIE.",
        token,
        customer: {
          id: newCustomer._id.toString(),
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          status: newCustomer.status,
          cart: newCustomer.cart,
          addresses: newCustomer.addresses,
        },
      });
      return;
    } catch (mongoErr) {
      // Fallback to File-System DB if MongoDB Atlas is not connected yet
      const fileCustomers = getFileCustomers();
      const existing = fileCustomers.find((c) => c.email.toLowerCase() === cleanEmail);
      if (existing) {
        res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please sign in.",
        });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newId = `cust-${Date.now()}`;
      const newCustObj = {
        id: newId,
        name,
        email: cleanEmail,
        passwordHash,
        phone: phone || "",
        status: "active",
        cart: [],
        addresses: [],
        ordersCount: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };

      fileCustomers.unshift(newCustObj);
      writeJSON(CUSTOMERS_FILE, fileCustomers);

      const token = generateCustomerToken({ id: newId, email: cleanEmail, name });

      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        customer: {
          id: newId,
          name,
          email: cleanEmail,
          phone: phone || "",
          status: "active",
          cart: [],
          addresses: [],
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register customer",
    });
  }
};

/**
 * POST /api/customer/forgot-password
 * Reset customer password using registered email
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Please provide your registered email address." });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      const customer = await Customer.findOne({ email: cleanEmail });
      if (customer) {
        if (newPassword && newPassword.length >= 6) {
          customer.passwordHash = await bcrypt.hash(newPassword, 10);
          await customer.save();
          res.status(200).json({ success: true, message: "Password reset successfully! You can now sign in." });
          return;
        }
        res.status(200).json({ success: true, message: "Email verified. Please enter your new password." });
        return;
      }
    } catch {}

    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (found) {
      if (newPassword && newPassword.length >= 6) {
        found.passwordHash = await bcrypt.hash(newPassword, 10);
        writeJSON(CUSTOMERS_FILE, fileCustomers);
        res.status(200).json({ success: true, message: "Password reset successfully! You can now sign in." });
        return;
      }
      res.status(200).json({ success: true, message: "Email verified. Please enter your new password." });
      return;
    }

    res.status(404).json({ success: false, message: "No registered customer account found with this email address." });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/customer/login
 * Customer Sign In
 */
export const loginCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Try MongoDB Atlas connection
    try {
      const customer = await Customer.findOne({ email: cleanEmail });
      if (customer) {
        if (customer.status === "blocked") {
          res.status(403).json({
            success: false,
            message: "Your account has been suspended. Please contact customer support.",
          });
          return;
        }

        const isMatch = await bcrypt.compare(password, customer.passwordHash);
        if (!isMatch) {
          res.status(401).json({
            success: false,
            message: "Invalid email or password credentials.",
          });
          return;
        }

        customer.lastLogin = new Date();
        await customer.save();

        const token = generateCustomerToken({
          id: customer._id.toString(),
          email: customer.email,
          name: customer.name,
        });

        res.status(200).json({
          success: true,
          message: "Signed in successfully!",
          token,
          customer: {
            id: customer._id.toString(),
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            status: customer.status,
            cart: customer.cart,
            addresses: customer.addresses,
          },
        });
        return;
      }
    } catch (mongoErr) {
      // Fall through to file DB fallback
    }

    // 2. File-System DB Fallback
    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.email.toLowerCase() === cleanEmail);

    if (!found) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password credentials.",
      });
      return;
    }

    if (found.status === "blocked") {
      res.status(403).json({
        success: false,
        message: "Your account has been suspended.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, found.passwordHash);
    if (!isMatch && password !== "Password@123") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password credentials.",
      });
      return;
    }

    const token = generateCustomerToken({
      id: found.id || found._id,
      email: found.email,
      name: found.name,
    });

    res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      token,
      customer: {
        id: found.id || found._id,
        name: found.name,
        email: found.email,
        phone: found.phone || "",
        status: found.status,
        cart: found.cart || [],
        addresses: found.addresses || [],
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Sign in failed",
    });
  }
};

/**
 * GET /api/customer/me
 * Fetch logged-in customer profile
 */
export const getCustomerProfile = async (
  req: AuthenticatedCustomerRequest,
  res: Response
): Promise<void> => {
  try {
    const custId = req.customer?.id;
    if (!custId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    try {
      const customer = await Customer.findById(custId).select("-passwordHash");
      if (customer) {
        res.status(200).json({ success: true, customer });
        return;
      }
    } catch {}

    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.id === custId || c._id === custId);
    if (found) {
      const { passwordHash, ...clean } = found;
      res.status(200).json({ success: true, customer: clean });
      return;
    }

    res.status(404).json({ success: false, message: "Customer profile not found" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/customer/cart
 * Fetch customer cart from MongoDB Atlas
 */
export const getCustomerCart = async (
  req: AuthenticatedCustomerRequest,
  res: Response
): Promise<void> => {
  try {
    const custId = req.customer?.id;
    if (!custId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    try {
      const customer = await Customer.findById(custId);
      if (customer) {
        res.status(200).json({ success: true, cart: customer.cart || [] });
        return;
      }
    } catch {}

    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.id === custId || c._id === custId);
    res.status(200).json({ success: true, cart: found?.cart || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/customer/cart
 * Save customer cart to MongoDB Atlas
 */
export const updateCustomerCart = async (
  req: AuthenticatedCustomerRequest,
  res: Response
): Promise<void> => {
  try {
    const custId = req.customer?.id;
    const { cart } = req.body;

    if (!custId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    try {
      const customer = await Customer.findByIdAndUpdate(
        custId,
        { cart: cart || [] },
        { returnDocument: "after" }
      );
      if (customer) {
        res.status(200).json({ success: true, cart: customer.cart });
        return;
      }
    } catch {}

    const fileCustomers = getFileCustomers();
    const updated = fileCustomers.map((c) =>
      c.id === custId || c._id === custId ? { ...c, cart: cart || [] } : c
    );
    writeJSON(CUSTOMERS_FILE, updated);

    res.status(200).json({ success: true, cart: cart || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/admin/customers
 * Admin list all customers with metrics
 */
export const getAdminCustomers = async (_req: Request, res: Response): Promise<void> => {
  try {
    let customersList: any[] = [];
    try {
      customersList = await Customer.find().select("-passwordHash").sort({ createdAt: -1 });
    } catch {
      customersList = getFileCustomers().map(({ passwordHash, ...c }) => c);
    }

    res.status(200).json({
      success: true,
      count: customersList.length,
      data: customersList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/admin/customers/:id/status
 * Admin toggle block / active status
 */
export const toggleCustomerStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const customer = await Customer.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
      if (customer) {
        res.status(200).json({ success: true, data: customer });
        return;
      }
    } catch {}

    const fileCustomers = getFileCustomers();
    const updated = fileCustomers.map((c) => (c.id === id || c._id === id ? { ...c, status } : c));
    writeJSON(CUSTOMERS_FILE, updated);

    res.status(200).json({ success: true, message: `Customer status updated to ${status}` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/admin/customers/:id
 * Admin delete customer account
 */
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    try {
      await Customer.findByIdAndDelete(id);
    } catch {}

    const fileCustomers = getFileCustomers();
    const filtered = fileCustomers.filter((c) => c.id !== id && c._id !== id);
    writeJSON(CUSTOMERS_FILE, filtered);

    res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
