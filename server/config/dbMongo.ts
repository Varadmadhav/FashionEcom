import mongoose from "mongoose";
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
        const seedData = initialProducts.map((p) => ({
          ...p,
          collectionName: p.collection || "Heritage",
          newArrival: true,
          badges: p.badges && p.badges.length > 0 ? p.badges : ["New Arrival"],
          addedAt: p.addedAt ? new Date(p.addedAt) : new Date(),
        }));
        await Product.insertMany(seedData);
        console.log(`🎉 Seeded ${seedData.length} products into MongoDB Atlas!`);
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
