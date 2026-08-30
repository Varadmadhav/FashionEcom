import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Product from "../models/Product";
import { products as initialProducts } from "../../src/data/products";

export const connectDB = async (): Promise<boolean> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI || MONGODB_URI.includes("<password>")) {
    console.log("ℹ️ MONGODB_URI not configured in .env. Server will run using file-system DB storage.");
    return false;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "fashion_ecom",
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed default products catalog into MongoDB if empty
    try {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log("📦 Seeding initial store catalog into MongoDB...");
        let catalogSource = initialProducts;
        const jsonPath = path.resolve(process.cwd(), "server", "data", "products.json");
        const altJsonPath = path.resolve(process.cwd(), "data", "products.json");
        if (catalogSource.length === 0 && fs.existsSync(jsonPath)) {
          catalogSource = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
        } else if (catalogSource.length === 0 && fs.existsSync(altJsonPath)) {
          catalogSource = JSON.parse(fs.readFileSync(altJsonPath, "utf-8"));
        }

        const seedData = catalogSource.map((p: any) => ({
          ...p,
          collectionName: p.collection || p.collectionName || "Heritage",
          newArrival: p.newArrival !== undefined ? p.newArrival : true,
          badges: p.badges && p.badges.length > 0 ? p.badges : ["New Arrival"],
          addedAt: p.addedAt ? new Date(p.addedAt) : new Date(),
        }));

        if (seedData.length > 0) {
          await Product.insertMany(seedData);
          console.log(`🎉 Seeded ${seedData.length} products into MongoDB Atlas!`);
        }
      }
    } catch (seedErr: any) {
      console.warn("MongoDB catalog seed warning:", seedErr.message);
    }

    return true;
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log("⚠️ Fallback to file-system DB active.");
    return false;
  }
};
