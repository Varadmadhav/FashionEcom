import { Request, Response } from "express";
import mongoose from "mongoose";
import MongoOrder from "../models/Order";
import Customer from "../models/Customer";
import { readOrdersDB, writeOrdersDB } from "../config/db";
import { AuthenticatedCustomerRequest } from "../middleware/customerAuth";

/**
 * GET /api/orders
 * Fetch all customer orders (Admin)
 */
export const getOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    try {
      const orders = await MongoOrder.find().sort({ date: -1 });
      if (orders) {
        res.status(200).json({
          success: true,
          count: orders.length,
          data: orders,
        });
        return;
      }
    } catch (mongoErr) {}

    const orders = readOrdersDB();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders",
    });
  }
};

/**
 * GET /api/orders/my-orders
 * Fetch private orders history for logged-in customer
 */
export const getCustomerOrders = async (
  req: AuthenticatedCustomerRequest,
  res: Response
): Promise<void> => {
  try {
    const email = req.customer?.email?.toLowerCase().trim();
    const customerId = req.customer?.id;

    if (!email && !customerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    try {
      const myOrders = await MongoOrder.find({
        $or: [{ email }, { customerId }],
      }).sort({ date: -1 });

      res.status(200).json({
        success: true,
        count: myOrders.length,
        data: myOrders,
      });
      return;
    } catch (mongoErr) {}

    const allOrders = readOrdersDB();
    const fileMyOrders = allOrders.filter(
      (o) => (o.email && o.email.toLowerCase() === email) || (o as any).customerId === customerId
    );

    res.status(200).json({
      success: true,
      count: fileMyOrders.length,
      data: fileMyOrders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/orders
 * Place a new order
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customerId,
      customerName,
      email,
      phone,
      shippingAddress,
      items,
      subtotal,
      discount,
      total,
      paymentMethod,
    } = req.body;

    if (!customerName || !email || !shippingAddress || !items || !total) {
      res.status(400).json({
        success: false,
        message: "Missing required order fields.",
      });
      return;
    }

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const cleanEmail = email.toLowerCase().trim();

    const itemsSummaryString = Array.isArray(items)
      ? items.map((i: any) => `${i.name} (${i.size}) x${i.quantity}`).join(", ")
      : String(items);

    const newOrderData = {
      id: orderId,
      customerId: customerId || "",
      customerName,
      email: cleanEmail,
      phone: phone || shippingAddress.phone || "",
      shippingAddress,
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal || total),
      discount: Number(discount || 0),
      total: Number(total),
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "Razorpay" ? "Paid" : "Pending",
      status: "Pending",
      date: new Date(),
    };

    // 1. Try MongoDB Atlas Save & Customer Metrics Update
    try {
      const createdOrder = await MongoOrder.create(newOrderData);

      // Increment Customer ordersCount and totalSpent in MongoDB Atlas
      if (cleanEmail) {
        await Customer.findOneAndUpdate(
          { email: cleanEmail },
          {
            $inc: { ordersCount: 1, totalSpent: Number(total) },
            $set: { cart: [] }, // Clear customer cart in DB
          }
        );
      }

      res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        data: createdOrder,
      });
      return;
    } catch (mongoErr) {}

    // 2. File-System DB Fallback
    const orders = readOrdersDB();
    const fallbackOrderObj = {
      id: orderId,
      customer: customerName,
      email: cleanEmail,
      items: itemsSummaryString,
      total: Number(total),
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    orders.unshift(fallbackOrderObj as any);
    writeOrdersDB(orders);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrderData,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

/**
 * PUT /api/orders/:id/status
 * Update order status (Admin)
 */
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const { status } = req.body;

    const validStatuses = ["Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    // 1. Try MongoDB Atlas update with safe Mongoose ObjectId check
    try {
      const isObjectId = typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24;
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };

      const updated = await MongoOrder.findOneAndUpdate(
        query,
        { status },
        { returnDocument: "after" }
      );

      if (updated) {
        res.status(200).json({
          success: true,
          message: `Order status updated to ${status}`,
          data: updated,
        });
        return;
      }
    } catch (mongoErr: any) {
      console.error("MongoDB Order update warning:", mongoErr.message);
    }

    // 2. Fallback to File-System DB
    const orders = readOrdersDB();
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = status as any;
      writeOrdersDB(orders);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: order,
      });
      return;
    }

    res.status(404).json({
      success: false,
      message: `Order with ID "${id}" not found`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};
