import { Request, Response } from "express";
import mongoose from "mongoose";
import MongoProduct from "../models/Product";
import { readProductsDB, writeProductsDB } from "../config/db";
import { Product } from "../../src/data/products";

/**
 * GET /api/products
 * Fetch product catalog from MongoDB Atlas (or file-system fallback)
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, badge, sort } = req.query;

    // 1. Try MongoDB Atlas connection
    try {
      const query: any = {};

      if (category && typeof category === "string" && category !== "all") {
        if (category === "new-in") {
          query.$or = [{ badges: "New Arrival" }, { newArrival: true }];
        } else {
          query.category = category;
        }
      }

      if (badge && typeof badge === "string") {
        query.badges = badge;
      }

      if (search && typeof search === "string") {
        const regex = new RegExp(search.trim(), "i");
        query.$or = [
          { name: regex },
          { sku: regex },
          { category: regex },
          { description: regex },
        ];
      }

      let sortOption: any = { addedAt: -1 };
      if (sort === "price-low") sortOption = { price: 1 };
      if (sort === "price-high") sortOption = { price: -1 };
      if (sort === "newest") sortOption = { addedAt: -1 };

      const mongoProducts = await MongoProduct.find(query).sort(sortOption);

      if (mongoProducts && mongoProducts.length > 0) {
        res.status(200).json({
          success: true,
          count: mongoProducts.length,
          data: mongoProducts,
        });
        return;
      }
    } catch (mongoErr) {
      // Fall through to File-System DB
    }

    // 2. Fallback to File-System DB
    let products = readProductsDB();

    if (category && typeof category === "string" && category !== "all") {
      if (category === "new-in") {
        products = products.filter((p) => p.badges?.includes("New Arrival") || p.newArrival);
      } else {
        products = products.filter((p) => p.category === category);
      }
    }

    if (badge && typeof badge === "string") {
      products = products.filter((p) => p.badges?.includes(badge));
    }

    if (search && typeof search === "string") {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sort && typeof sort === "string") {
      if (sort === "price-low") products.sort((a, b) => a.price - b.price);
      if (sort === "price-high") products.sort((a, b) => b.price - a.price);
      if (sort === "newest") products.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    } else {
      products.sort((a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime());
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve products",
    });
  }
};

/**
 * GET /api/products/:slug
 * Fetch product details by slug from MongoDB Atlas
 */
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    try {
      const product = await MongoProduct.findOne({
        $or: [{ slug }, { id: slug }],
      });
      if (product) {
        res.status(200).json({ success: true, data: product });
        return;
      }
    } catch (mongoErr) {}

    const products = readProductsDB();
    const product = products.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with slug or ID "${slug}" not found`,
      });
      return;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/products
 * Create new product in MongoDB Atlas (Admin authenticated)
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;

    if (!body.name || !body.price || body.stockQuantity === undefined) {
      res.status(400).json({
        success: false,
        message: "Missing required product fields: name, price, stockQuantity",
      });
      return;
    }

    const id = body.id || `p-${Date.now()}`;
    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const sku = body.sku || `AUR-${body.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProductObj = {
      id,
      slug,
      name: body.name,
      sku,
      category: body.category || "dresses",
      collectionName: body.collection || "Heritage",
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      images: [
        body.images?.[0] || "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80",
        body.images?.[1] || "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      ],
      galleryImages: body.galleryImages || [],
      sizes: body.sizes || ["XS", "S", "M", "L", "XL"],
      description: body.description || "",
      details: body.details || [
        `${body.collection || "Heritage"} collection item`,
        `Finish: ${body.finish || "Polished"}`,
      ],
      badges: body.badges && body.badges.length > 0 ? body.badges : ["New Arrival"],
      newArrival: true,
      featured: Boolean(body.featured || body.badges?.includes("Best Seller")),
      availability: Number(body.stockQuantity) > 0,
      stockQuantity: Number(body.stockQuantity),
      lowStockThreshold: Number(body.lowStockThreshold || 5),
      finish: body.finish || "Polished",
      estimatedDelivery: body.estimatedDelivery || "3-5 Days",
      occasions: body.occasions || [],
      addedAt: new Date(),
    };

    // 1. Write to MongoDB Atlas
    try {
      const createdMongo = await MongoProduct.create(newProductObj);
      res.status(201).json({
        success: true,
        message: "Product created successfully in MongoDB Atlas",
        data: createdMongo,
      });
    } catch (mongoErr) {
      // 2. Fallback to File-System DB
      const products = readProductsDB();
      products.unshift(newProductObj as any);
      writeProductsDB(products);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProductObj,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

/**
 * PUT /api/products/:id
 * Update product in MongoDB Atlas (Admin authenticated)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const updates = req.body;

    try {
      const isObjectId = typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24;
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };

      const updated = await MongoProduct.findOneAndUpdate(
        query,
        { ...updates },
        { returnDocument: "after" }
      );
      if (updated) {
        res.status(200).json({ success: true, data: updated });
        return;
      }
    } catch (mongoErr: any) {
      console.warn("MongoDB updateProduct warning:", mongoErr.message);
    }

    const products = readProductsDB();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const current = products[index];
      const updatedProduct = { ...current, ...updates };
      products[index] = updatedProduct;
      writeProductsDB(products);
      res.status(200).json({ success: true, data: updatedProduct });
      return;
    }

    res.status(404).json({ success: false, message: `Product "${id}" not found` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/products/:id
 * Delete product from MongoDB Atlas (Admin authenticated)
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);

    try {
      const isObjectId = typeof id === "string" && mongoose.Types.ObjectId.isValid(id) && id.length === 24;
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };

      await MongoProduct.findOneAndDelete(query);
    } catch (mongoErr: any) {
      console.warn("MongoDB deleteProduct warning:", mongoErr.message);
    }

    let products = readProductsDB();
    products = products.filter((p) => p.id !== id);
    writeProductsDB(products);

    res.status(200).json({ success: true, message: "Product deleted successfully", id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
