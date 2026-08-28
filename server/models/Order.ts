import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  id: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: IShippingAddress;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "Razorpay" | "COD";
  paymentStatus: "Paid" | "Pending";
  status: "Pending" | "Packed" | "Out for Delivery" | "Delivered" | "Cancelled";
  date: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, index: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String, default: "" },
    shippingAddress: { type: ShippingAddressSchema, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Razorpay", "COD"], default: "COD" },
    paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    status: {
      type: String,
      enum: ["Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },
    date: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
