export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: "dresses" | "tops" | "bottoms" | "coords";
  collection: string;
  price: number;
  originalPrice?: number;
  images: [string, string]; // [mainImage, hoverImage]
  galleryImages: string[]; // up to 6 additional gallery images for PDP
  sizes: string[];
  description: string;
  details: string[];
  newArrival: boolean;
  featured: boolean;
  availability: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  finish?: string;
  estimatedDelivery: string;
  badges: string[]; // "Best Seller" | "New Arrival" | "On Sale"
  occasions: string[]; // "Daily Wear" | "Office Wear" | "Party Wear" | "Wedding" | "Festive"
  addedAt: string; // ISO timestamp for sorting new arrivals
}

export const products: Product[] = [];
