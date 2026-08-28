import fs from "fs";
import path from "path";
import { products as initialProducts, Product } from "../../src/data/products";

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

const DATA_DIR = path.join(process.cwd(), "server", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed orders
const initialOrders: Order[] = [
  {
    id: "ORD-9482",
    customer: "Eleanor Vance",
    email: "eleanor@example.com",
    items: "Iris Embroidered Kurta (S)",
    total: 8450,
    status: "Delivered",
    date: "2026-08-25",
  },
  {
    id: "ORD-9483",
    customer: "Aria Montgomery",
    email: "aria@example.com",
    items: "Meera Flared Dress (M), Zara Top (S)",
    total: 10530,
    status: "Processing",
    date: "2026-08-26",
  },
  {
    id: "ORD-9484",
    customer: "Sophia Sterling",
    email: "sophia@example.com",
    items: "Noor Co-ord Set (L)",
    total: 8950,
    status: "Shipped",
    date: "2026-08-26",
  },
  {
    id: "ORD-9485",
    customer: "Isabella Rossi",
    email: "isabella@example.com",
    items: "Ana Midi Dress (XS)",
    total: 5950,
    status: "Pending",
    date: "2026-08-27",
  },
];

// Initialize JSON files if missing
if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2));
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2));
}

export const readProductsDB = (): Product[] => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products DB:", error);
    return initialProducts;
  }
};

export const writeProductsDB = (products: Product[]): void => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error writing products DB:", error);
  }
};

export const readOrdersDB = (): Order[] => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders DB:", error);
    return initialOrders;
  }
};

export const writeOrdersDB = (orders: Order[]): void => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error writing orders DB:", error);
  }
};

export const readJSON = <T>(fileName: string, defaultData: T): T => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return defaultData;
  }
};

export const writeJSON = <T>(fileName: string, data: T): void => {
  const filePath = path.join(DATA_DIR, fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
  }
};
