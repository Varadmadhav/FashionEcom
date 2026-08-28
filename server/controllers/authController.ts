import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fashion_ecom_jwt_secret_key_2026";

// Standard Admin Credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aurelie.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/**
 * POST /api/auth/login
 * Admin Login endpoint generating JWT token
 */
export const login = (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    if (
      email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        email: ADMIN_EMAIL,
        role: "ADMIN",
        name: "Store Administrator",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Admin authentication successful",
      token,
      user: {
        email: ADMIN_EMAIL,
        name: "Store Administrator",
        role: "ADMIN",
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

/**
 * GET /api/auth/me
 * Verify current JWT token
 */
export const verifyAuth = (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};
