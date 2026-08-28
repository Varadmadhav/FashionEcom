import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: string;
  collectionName?: string;
  price: number;
  originalPrice?: number;
  images: [string, string];
  galleryImages: string[];
  sizes: string[];
  description: string;
  details: string[];
  newArrival: boolean;
  featured: boolean;
  availability: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  finish?: string;
  estimatedDelivery?: string;
  badges: string[];
  occasions: string[];
  addedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    collectionName: { type: String, default: "Heritage" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: { type: [String], required: true },
    galleryImages: { type: [String], default: [] },
    sizes: { type: [String], default: ["XS", "S", "M", "L", "XL"] },
    description: { type: String, default: "" },
    details: { type: [String], default: [] },
    newArrival: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false },
    availability: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 20 },
    lowStockThreshold: { type: Number, default: 5 },
    finish: { type: String, default: "Polished" },
    estimatedDelivery: { type: String, default: "3-5 Days" },
    badges: { type: [String], default: ["New Arrival"] },
    occasions: { type: [String], default: [] },
    addedAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
