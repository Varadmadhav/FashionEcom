import { Request, Response } from "express";
import { readProductsDB, writeProductsDB } from "../config/db";
import { Product } from "../../src/data/products";

/**
 * GET /api/products
 * Fetch product catalog with optional filtering, category, search, sorting
 */
export const getProducts = (req: Request, res: Response): void => {
  try {
    let products = readProductsDB();
    const { category, search, badge, sort } = req.query;

    if (category && typeof category === "string" && category !== "all") {
      if (category === "new-in") {
        products = products.filter(
          (p) => p.badges?.includes("New Arrival") || p.newArrival
        );
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
      if (sort === "price-low") {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === "price-high") {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === "newest") {
        products.sort(
          (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
      }
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
 * Fetch product details by slug
 */
export const getProductBySlug = (req: Request, res: Response): void => {
  try {
    const { slug } = req.params;
    const products = readProductsDB();
    const product = products.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with slug or ID "${slug}" not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve product details",
    });
  }
};

/**
 * POST /api/products
 * Create new product (Admin authenticated)
 */
export const createProduct = (req: Request, res: Response): void => {
  try {
    const body = req.body;

    if (!body.name || !body.price || body.stockQuantity === undefined) {
      res.status(400).json({
        success: false,
        message: "Missing required product fields: name, price, stockQuantity",
      });
      return;
    }

    const products = readProductsDB();
    const id = `p-${Date.now()}`;
    const slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const sku = body.sku || `AUR-${body.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct: Product = {
      id,
      slug,
      name: body.name,
      sku,
      category: body.category || "dresses",
      collection: body.collection || "Heritage",
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
      newArrival: Boolean(body.newArrival || body.badges?.includes("New Arrival")),
      featured: Boolean(body.featured || body.badges?.includes("Best Seller")),
      availability: Number(body.stockQuantity) > 0,
      stockQuantity: Number(body.stockQuantity),
      lowStockThreshold: Number(body.lowStockThreshold || 5),
      finish: body.finish || "Polished",
      estimatedDelivery: body.estimatedDelivery || "3-5 Days",
      badges: body.badges || [],
      occasions: body.occasions || [],
      addedAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    writeProductsDB(products);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

/**
 * PUT /api/products/:id
 * Update existing product (Admin authenticated)
 */
export const updateProduct = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const products = readProductsDB();

    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({
        success: false,
        message: `Product with ID "${id}" not found`,
      });
      return;
    }

    const current = products[index];

    const updatedProduct: Product = {
      ...current,
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : current.price,
      stockQuantity: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) : current.stockQuantity,
      availability: updates.stockQuantity !== undefined ? Number(updates.stockQuantity) > 0 : current.availability,
    };

    products[index] = updatedProduct;
    writeProductsDB(products);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

/**
 * DELETE /api/products/:id
 * Delete product (Admin authenticated)
 */
export const deleteProduct = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    let products = readProductsDB();

    const exists = products.some((p) => p.id === id);
    if (!exists) {
      res.status(404).json({
        success: false,
        message: `Product with ID "${id}" not found`,
      });
      return;
    }

    products = products.filter((p) => p.id !== id);
    writeProductsDB(products);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      id,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};
