import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/Product";
import { products as initialProducts } from "../../src/data/products";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "server", ".env") });

async function seedMongoCatalog() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI || MONGODB_URI.includes("<password>")) {
    console.error("❌ MONGODB_URI missing in .env");
    process.exit(1);
  }

  console.log("🍃 Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, { dbName: "fashion_ecom" });

  console.log("📦 Creating and seeding 'products' collection...");
  const count = await Product.countDocuments();

  if (count === 0) {
    let catalogSource = initialProducts;
    const jsonPath = path.resolve(process.cwd(), "server", "data", "products.json");
    if (catalogSource.length === 0 && fs.existsSync(jsonPath)) {
      catalogSource = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
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
      console.log(`✅ Successfully seeded ${seedData.length} products into 'fashion_ecom.products' collection!`);
    } else {
      console.warn("⚠️ No products found to seed.");
    }
  } else {
    console.log(`ℹ️ 'fashion_ecom.products' collection already has ${count} items.`);
  }

  await mongoose.disconnect();
  console.log("👋 Disconnected.");
}

seedMongoCatalog().catch(console.error);
