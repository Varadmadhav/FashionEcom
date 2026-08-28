import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedCustomerRequest extends Request {
  customer?: {
    id: string;
    email: string;
    name: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "fashion_ecom_customer_jwt_secret_2026";

export const authenticateCustomer = (
  req: AuthenticatedCustomerRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };

    req.customer = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please sign in again.",
    });
  }
};
