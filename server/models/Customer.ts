import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface ICustomerCartItem {
  productId: string;
  quantity: number;
  selectedSize?: string;
}

export interface ICustomer extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  status: "active" | "blocked";
  addresses: ICustomerAddress[];
  cart: ICustomerCartItem[];
  ordersCount: number;
  totalSpent: number;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerAddressSchema = new Schema<ICustomerAddress>({
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false },
});

const CustomerCartItemSchema = new Schema<ICustomerCartItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, default: "M" },
});

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    addresses: [CustomerAddressSchema],
    cart: [CustomerCartItemSchema],
    ordersCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
