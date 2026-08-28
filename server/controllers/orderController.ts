import { Request, Response } from "express";
import { readOrdersDB, writeOrdersDB, Order } from "../config/db";

/**
 * GET /api/orders
 * Fetch all customer orders (Admin)
 */
export const getOrders = (_req: Request, res: Response): void => {
  try {
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
 * POST /api/orders
 * Place a new order
 */
export const createOrder = (req: Request, res: Response): void => {
  try {
    const { customer, email, items, total } = req.body;

    if (!customer || !email || !items || !total) {
      res.status(400).json({
        success: false,
        message: "Missing required order fields: customer, email, items, total",
      });
      return;
    }

    const orders = readOrdersDB();
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id,
      customer,
      email,
      items,
      total: Number(total),
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    orders.unshift(newOrder);
    writeOrdersDB(orders);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * PUT /api/orders/:id/status
 * Update order status (Admin)
 */
export const updateOrderStatus = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orders = readOrdersDB();

    const order = orders.find((o) => o.id === id);
    if (!order) {
      res.status(404).json({
        success: false,
        message: `Order with ID "${id}" not found`,
      });
      return;
    }

    order.status = status;
    writeOrdersDB(orders);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};
