import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "fashion_ecom_jwt_secret_key_2026";

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      email: string;
      role: string;
    };

    if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        message: "Forbidden. Admin privileges required.",
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};
