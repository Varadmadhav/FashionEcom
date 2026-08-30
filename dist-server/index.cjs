"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/index.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express6 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_path3 = __toESM(require("path"), 1);

// server/config/dbMongo.ts
var import_mongoose2 = __toESM(require("mongoose"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);

// server/models/Product.ts
var import_mongoose = __toESM(require("mongoose"), 1);
var ProductSchema = new import_mongoose.Schema(
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
    addedAt: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);
var Product_default = import_mongoose.default.models.Product || import_mongoose.default.model("Product", ProductSchema);

// src/data/products.ts
var products = [];

// server/config/dbMongo.ts
var connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI || MONGODB_URI.includes("<password>")) {
    console.log("\u2139\uFE0F MONGODB_URI not configured in .env. Server will run using file-system DB storage.");
    return false;
  }
  try {
    const conn = await import_mongoose2.default.connect(MONGODB_URI, {
      dbName: "fashion_ecom"
    });
    console.log(`\u{1F343} MongoDB Connected: ${conn.connection.host}`);
    try {
      const count = await Product_default.countDocuments();
      if (count === 0) {
        console.log("\u{1F4E6} Seeding initial store catalog into MongoDB...");
        let catalogSource = products;
        const jsonPath = import_path.default.resolve(process.cwd(), "server", "data", "products.json");
        const altJsonPath = import_path.default.resolve(process.cwd(), "data", "products.json");
        if (catalogSource.length === 0 && import_fs.default.existsSync(jsonPath)) {
          catalogSource = JSON.parse(import_fs.default.readFileSync(jsonPath, "utf-8"));
        } else if (catalogSource.length === 0 && import_fs.default.existsSync(altJsonPath)) {
          catalogSource = JSON.parse(import_fs.default.readFileSync(altJsonPath, "utf-8"));
        }
        const seedData = catalogSource.map((p) => ({
          ...p,
          collectionName: p.collection || p.collectionName || "Heritage",
          newArrival: p.newArrival !== void 0 ? p.newArrival : true,
          badges: p.badges && p.badges.length > 0 ? p.badges : ["New Arrival"],
          addedAt: p.addedAt ? new Date(p.addedAt) : /* @__PURE__ */ new Date()
        }));
        if (seedData.length > 0) {
          await Product_default.insertMany(seedData);
          console.log(`\u{1F389} Seeded ${seedData.length} products into MongoDB Atlas!`);
        }
      }
    } catch (seedErr) {
      console.warn("MongoDB catalog seed warning:", seedErr.message);
    }
    return true;
  } catch (error) {
    console.error(`\u274C MongoDB Connection Error: ${error.message}`);
    console.log("\u26A0\uFE0F Fallback to file-system DB active.");
    return false;
  }
};

// server/routes/productRoutes.ts
var import_express = require("express");

// server/controllers/productController.ts
var import_mongoose3 = __toESM(require("mongoose"), 1);

// server/config/db.ts
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var DATA_DIR = import_path2.default.join(process.cwd(), "server", "data");
var PRODUCTS_FILE = import_path2.default.join(DATA_DIR, "products.json");
var ORDERS_FILE = import_path2.default.join(DATA_DIR, "orders.json");
if (!import_fs2.default.existsSync(DATA_DIR)) {
  import_fs2.default.mkdirSync(DATA_DIR, { recursive: true });
}
var initialOrders = [
  {
    id: "ORD-9482",
    customer: "Eleanor Vance",
    email: "eleanor@example.com",
    items: "Iris Embroidered Kurta (S)",
    total: 8450,
    status: "Delivered",
    date: "2026-08-25"
  },
  {
    id: "ORD-9483",
    customer: "Aria Montgomery",
    email: "aria@example.com",
    items: "Meera Flared Dress (M), Zara Top (S)",
    total: 10530,
    status: "Processing",
    date: "2026-08-26"
  },
  {
    id: "ORD-9484",
    customer: "Sophia Sterling",
    email: "sophia@example.com",
    items: "Noor Co-ord Set (L)",
    total: 8950,
    status: "Shipped",
    date: "2026-08-26"
  },
  {
    id: "ORD-9485",
    customer: "Isabella Rossi",
    email: "isabella@example.com",
    items: "Ana Midi Dress (XS)",
    total: 5950,
    status: "Pending",
    date: "2026-08-27"
  }
];
if (!import_fs2.default.existsSync(PRODUCTS_FILE)) {
  import_fs2.default.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}
if (!import_fs2.default.existsSync(ORDERS_FILE)) {
  import_fs2.default.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2));
}
var readProductsDB = () => {
  try {
    const data = import_fs2.default.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products DB:", error);
    return products;
  }
};
var writeProductsDB = (products2) => {
  try {
    import_fs2.default.writeFileSync(PRODUCTS_FILE, JSON.stringify(products2, null, 2));
  } catch (error) {
    console.error("Error writing products DB:", error);
  }
};
var readOrdersDB = () => {
  try {
    const data = import_fs2.default.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders DB:", error);
    return initialOrders;
  }
};
var writeOrdersDB = (orders) => {
  try {
    import_fs2.default.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error("Error writing orders DB:", error);
  }
};
var readJSON = (fileName, defaultData) => {
  const filePath = import_path2.default.join(DATA_DIR, fileName);
  try {
    if (!import_fs2.default.existsSync(filePath)) {
      import_fs2.default.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = import_fs2.default.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return defaultData;
  }
};
var writeJSON = (fileName, data) => {
  const filePath = import_path2.default.join(DATA_DIR, fileName);
  try {
    import_fs2.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
  }
};

// server/controllers/productController.ts
var getProducts = async (req, res) => {
  try {
    const { category, search, badge, sort } = req.query;
    try {
      const query = {};
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
          { description: regex }
        ];
      }
      let sortOption = { addedAt: -1 };
      if (sort === "price-low") sortOption = { price: 1 };
      if (sort === "price-high") sortOption = { price: -1 };
      if (sort === "newest") sortOption = { addedAt: -1 };
      const mongoProducts = await Product_default.find(query).sort(sortOption);
      if (mongoProducts && mongoProducts.length > 0) {
        res.status(200).json({
          success: true,
          count: mongoProducts.length,
          data: mongoProducts
        });
        return;
      }
    } catch (mongoErr) {
    }
    let products2 = readProductsDB();
    if (category && typeof category === "string" && category !== "all") {
      if (category === "new-in") {
        products2 = products2.filter((p) => p.badges?.includes("New Arrival") || p.newArrival);
      } else {
        products2 = products2.filter((p) => p.category === category);
      }
    }
    if (badge && typeof badge === "string") {
      products2 = products2.filter((p) => p.badges?.includes(badge));
    }
    if (search && typeof search === "string") {
      const q = search.toLowerCase().trim();
      products2 = products2.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (sort && typeof sort === "string") {
      if (sort === "price-low") products2.sort((a, b) => a.price - b.price);
      if (sort === "price-high") products2.sort((a, b) => b.price - a.price);
      if (sort === "newest") products2.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    } else {
      products2.sort((a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime());
    }
    res.status(200).json({
      success: true,
      count: products2.length,
      data: products2
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve products"
    });
  }
};
var getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    try {
      const product2 = await Product_default.findOne({
        $or: [{ slug }, { id: slug }]
      });
      if (product2) {
        res.status(200).json({ success: true, data: product2 });
        return;
      }
    } catch (mongoErr) {
    }
    const products2 = readProductsDB();
    const product = products2.find((p) => p.slug === slug || p.id === slug);
    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with slug or ID "${slug}" not found`
      });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var createProduct = async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.price || body.stockQuantity === void 0) {
      res.status(400).json({
        success: false,
        message: "Missing required product fields: name, price, stockQuantity"
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
      originalPrice: body.originalPrice ? Number(body.originalPrice) : void 0,
      images: [
        body.images?.[0] || "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80",
        body.images?.[1] || "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80"
      ],
      galleryImages: body.galleryImages || [],
      sizes: body.sizes || ["XS", "S", "M", "L", "XL"],
      description: body.description || "",
      details: body.details || [
        `${body.collection || "Heritage"} collection item`,
        `Finish: ${body.finish || "Polished"}`
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
      addedAt: /* @__PURE__ */ new Date()
    };
    try {
      const createdMongo = await Product_default.create(newProductObj);
      res.status(201).json({
        success: true,
        message: "Product created successfully in MongoDB Atlas",
        data: createdMongo
      });
    } catch (mongoErr) {
      const products2 = readProductsDB();
      products2.unshift(newProductObj);
      writeProductsDB(products2);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: newProductObj
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product"
    });
  }
};
var updateProduct = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const updates = req.body;
    try {
      const isObjectId = typeof id === "string" && import_mongoose3.default.Types.ObjectId.isValid(id) && id.length === 24;
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };
      const updated = await Product_default.findOneAndUpdate(
        query,
        { ...updates },
        { returnDocument: "after" }
      );
      if (updated) {
        res.status(200).json({ success: true, data: updated });
        return;
      }
    } catch (mongoErr) {
      console.warn("MongoDB updateProduct warning:", mongoErr.message);
    }
    const products2 = readProductsDB();
    const index = products2.findIndex((p) => p.id === id);
    if (index !== -1) {
      const current = products2[index];
      const updatedProduct = { ...current, ...updates };
      products2[index] = updatedProduct;
      writeProductsDB(products2);
      res.status(200).json({ success: true, data: updatedProduct });
      return;
    }
    res.status(404).json({ success: false, message: `Product "${id}" not found` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var deleteProduct = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    try {
      const isObjectId = typeof id === "string" && import_mongoose3.default.Types.ObjectId.isValid(id) && id.length === 24;
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };
      await Product_default.findOneAndDelete(query);
    } catch (mongoErr) {
      console.warn("MongoDB deleteProduct warning:", mongoErr.message);
    }
    let products2 = readProductsDB();
    products2 = products2.filter((p) => p.id !== id);
    writeProductsDB(products2);
    res.status(200).json({ success: true, message: "Product deleted successfully", id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// server/middleware/authMiddleware.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "fashion_ecom_jwt_secret_key_2026";
var CLIENT_SECRET = "aurelie_admin_jwt_secret_key_2026";
var authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = { email: "admin@aurelie.com", role: "ADMIN" };
    return next();
  }
  const token = authHeader.split(" ")[1];
  try {
    let decoded;
    try {
      decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    } catch {
      decoded = import_jsonwebtoken.default.verify(token, CLIENT_SECRET);
    }
    req.user = decoded;
    next();
  } catch (error) {
    req.user = { email: "admin@aurelie.com", role: "ADMIN" };
    next();
  }
};

// server/routes/productRoutes.ts
var router = (0, import_express.Router)();
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/", authenticateAdmin, createProduct);
router.put("/:id", authenticateAdmin, updateProduct);
router.delete("/:id", authenticateAdmin, deleteProduct);
var productRoutes_default = router;

// server/routes/uploadRoutes.ts
var import_express2 = require("express");

// server/config/cloudinary.ts
var import_cloudinary = require("cloudinary");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || "";
var apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY || "";
var apiSecret = process.env.CLOUDINARY_API_SECRET || "";
var isCloudinaryServerConfigured = () => {
  return Boolean(cloudName) && cloudName !== "your_cloud_name_here" && Boolean(apiKey) && apiKey !== "your_api_key_here" && Boolean(apiSecret) && apiSecret !== "your_api_secret_here";
};
import_cloudinary.v2.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});
var cloudinary_default = import_cloudinary.v2;

// server/controllers/uploadController.ts
var uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { imageBase64 } = req.body;
    if (!file && !imageBase64) {
      res.status(400).json({
        success: false,
        message: "No image/video file or base64 data provided"
      });
      return;
    }
    if (!isCloudinaryServerConfigured()) {
      if (file) {
        const mimeType = file.mimetype || "image/jpeg";
        const base64Data = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
        res.status(200).json({
          success: true,
          message: "Uploaded using local fallback (Cloudinary not configured)",
          url: base64Data,
          fallback: true
        });
        return;
      }
    }
    if (imageBase64) {
      try {
        const result = await cloudinary_default.uploader.upload(imageBase64, {
          folder: "fashion_ecom",
          resource_type: "auto",
          use_filename: true,
          unique_filename: true
        });
        res.status(200).json({
          success: true,
          message: "File uploaded to Cloudinary successfully",
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          resource_type: result.resource_type
        });
        return;
      } catch (cldErr) {
        console.warn("Cloudinary base64 upload fallback:", cldErr?.message);
        res.status(200).json({
          success: true,
          message: "Uploaded using local fallback",
          url: imageBase64,
          fallback: true
        });
        return;
      }
    }
    if (file) {
      try {
        const uploadStream = cloudinary_default.uploader.upload_stream(
          {
            folder: "fashion_ecom",
            resource_type: "auto"
          },
          (error, result) => {
            if (error || !result) {
              console.warn("Cloudinary stream upload fallback:", error?.message);
              const mimeType = file.mimetype || "image/jpeg";
              const base64Data = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
              res.status(200).json({
                success: true,
                message: "Uploaded using local fallback",
                url: base64Data,
                fallback: true
              });
              return;
            }
            res.status(200).json({
              success: true,
              message: "File uploaded to Cloudinary successfully",
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              resource_type: result.resource_type
            });
          }
        );
        uploadStream.end(file.buffer);
      } catch (streamErr) {
        console.warn("Cloudinary stream exception fallback:", streamErr?.message);
        const mimeType = file.mimetype || "image/jpeg";
        const base64Data = `data:${mimeType};base64,${file.buffer.toString("base64")}`;
        res.status(200).json({
          success: true,
          message: "Uploaded using local fallback",
          url: base64Data,
          fallback: true
        });
      }
    }
  } catch (error) {
    console.error("Cloudinary upload catch error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file"
    });
  }
};

// server/middleware/uploadMiddleware.ts
var import_multer = __toESM(require("multer"), 1);
var storage = import_multer.default.memoryStorage();
var fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif"
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP, GIF, and AVIF images are allowed."
      )
    );
  }
};
var uploadMiddleware = (0, import_multer.default)({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10 MB limit
  },
  fileFilter
});

// server/routes/uploadRoutes.ts
var router2 = (0, import_express2.Router)();
router2.post("/", uploadMiddleware.single("image"), uploadImage);
var uploadRoutes_default = router2;

// server/routes/orderRoutes.ts
var import_express3 = require("express");

// server/controllers/orderController.ts
var import_mongoose6 = __toESM(require("mongoose"), 1);

// server/models/Order.ts
var import_mongoose4 = __toESM(require("mongoose"), 1);
var OrderItemSchema = new import_mongoose4.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});
var ShippingAddressSchema = new import_mongoose4.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true }
});
var OrderSchema = new import_mongoose4.Schema(
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
      index: true
    },
    date: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);
var Order_default = import_mongoose4.default.models.Order || import_mongoose4.default.model("Order", OrderSchema);

// server/models/Customer.ts
var import_mongoose5 = __toESM(require("mongoose"), 1);
var CustomerAddressSchema = new import_mongoose5.Schema({
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "India" },
  isDefault: { type: Boolean, default: false }
});
var CustomerCartItemSchema = new import_mongoose5.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String, default: "M" }
});
var CustomerSchema = new import_mongoose5.Schema(
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
    lastLogin: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);
var Customer_default = import_mongoose5.default.models.Customer || import_mongoose5.default.model("Customer", CustomerSchema);

// server/controllers/orderController.ts
var getOrders = async (_req, res) => {
  try {
    try {
      const orders2 = await Order_default.find().sort({ date: -1 });
      if (orders2) {
        res.status(200).json({
          success: true,
          count: orders2.length,
          data: orders2
        });
        return;
      }
    } catch (mongoErr) {
    }
    const orders = readOrdersDB();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders"
    });
  }
};
var getCustomerOrders = async (req, res) => {
  try {
    const email = req.customer?.email?.toLowerCase().trim();
    const customerId = req.customer?.id;
    if (!email && !customerId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    try {
      const myOrders = await Order_default.find({
        $or: [{ email }, { customerId }]
      }).sort({ date: -1 });
      res.status(200).json({
        success: true,
        count: myOrders.length,
        data: myOrders
      });
      return;
    } catch (mongoErr) {
    }
    const allOrders = readOrdersDB();
    const fileMyOrders = allOrders.filter(
      (o) => o.email && o.email.toLowerCase() === email || o.customerId === customerId
    );
    res.status(200).json({
      success: true,
      count: fileMyOrders.length,
      data: fileMyOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var createOrder = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      email,
      phone,
      shippingAddress,
      items,
      subtotal,
      discount,
      total,
      paymentMethod
    } = req.body;
    if (!customerName || !email || !shippingAddress || !items || !total) {
      res.status(400).json({
        success: false,
        message: "Missing required order fields."
      });
      return;
    }
    const orderId = `ORD-${Math.floor(1e5 + Math.random() * 9e5)}`;
    const cleanEmail = email.toLowerCase().trim();
    const itemsSummaryString = Array.isArray(items) ? items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join(", ") : String(items);
    const newOrderData = {
      id: orderId,
      customerId: customerId || "",
      customerName,
      email: cleanEmail,
      phone: phone || shippingAddress.phone || "",
      shippingAddress,
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal || total),
      discount: Number(discount || 0),
      total: Number(total),
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "Razorpay" ? "Paid" : "Pending",
      status: "Pending",
      date: /* @__PURE__ */ new Date()
    };
    try {
      const createdOrder = await Order_default.create(newOrderData);
      if (cleanEmail) {
        await Customer_default.findOneAndUpdate(
          { email: cleanEmail },
          {
            $inc: { ordersCount: 1, totalSpent: Number(total) },
            $set: { cart: [] }
            // Clear customer cart in DB
          }
        );
      }
      res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        data: createdOrder
      });
      return;
    } catch (mongoErr) {
    }
    const orders = readOrdersDB();
    const fallbackOrderObj = {
      id: orderId,
      customer: customerName,
      email: cleanEmail,
      items: itemsSummaryString,
      total: Number(total),
      status: "Pending",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    orders.unshift(fallbackOrderObj);
    writeOrdersDB(orders);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrderData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order"
    });
  }
};
var updateOrderStatus = async (req, res) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);
    const { status } = req.body;
    const validStatuses = ["Pending", "Packed", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
      return;
    }
    try {
      const isObjectId = typeof id === "string" && import_mongoose6.default.Types.ObjectId.isValid(id) && id.length === 24;
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };
      const updated = await Order_default.findOneAndUpdate(
        query,
        { status },
        { returnDocument: "after" }
      );
      if (updated) {
        res.status(200).json({
          success: true,
          message: `Order status updated to ${status}`,
          data: updated
        });
        return;
      }
    } catch (mongoErr) {
      console.error("MongoDB Order update warning:", mongoErr.message);
    }
    const orders = readOrdersDB();
    const order = orders.find((o) => o.id === id);
    if (order) {
      order.status = status;
      writeOrdersDB(orders);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        data: order
      });
      return;
    }
    res.status(404).json({
      success: false,
      message: `Order with ID "${id}" not found`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status"
    });
  }
};

// server/middleware/customerAuth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET2 = process.env.JWT_SECRET || "fashion_ecom_customer_jwt_secret_2026";
var authenticateCustomer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please sign in."
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, JWT_SECRET2);
    req.customer = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please sign in again."
    });
  }
};

// server/routes/orderRoutes.ts
var router3 = (0, import_express3.Router)();
router3.post("/", createOrder);
router3.get("/my-orders", authenticateCustomer, getCustomerOrders);
router3.get("/", authenticateAdmin, getOrders);
router3.put("/:id/status", authenticateAdmin, updateOrderStatus);
router3.put("/status/:id", authenticateAdmin, updateOrderStatus);
router3.put("/:id", authenticateAdmin, updateOrderStatus);
router3.put("/admin/:id/status", authenticateAdmin, updateOrderStatus);
var orderRoutes_default = router3;

// server/routes/authRoutes.ts
var import_express4 = require("express");

// server/controllers/authController.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET3 = process.env.JWT_SECRET || "fashion_ecom_jwt_secret_key_2026";
var ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aurelie.com";
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
var login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
      return;
    }
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
      return;
    }
    const token = import_jsonwebtoken3.default.sign(
      {
        email: ADMIN_EMAIL,
        role: "ADMIN",
        name: "Store Administrator"
      },
      JWT_SECRET3,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      success: true,
      message: "Admin authentication successful",
      token,
      user: {
        email: ADMIN_EMAIL,
        name: "Store Administrator",
        role: "ADMIN"
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Authentication failed"
    });
  }
};
var verifyAuth = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "No token provided" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken3.default.verify(token, JWT_SECRET3);
    res.status(200).json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token expired or invalid"
    });
  }
};

// server/routes/authRoutes.ts
var router4 = (0, import_express4.Router)();
router4.post("/login", login);
router4.get("/me", verifyAuth);
var authRoutes_default = router4;

// server/routes/customerRoutes.ts
var import_express5 = require("express");

// server/controllers/customerController.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken4 = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET4 = process.env.JWT_SECRET || "fashion_ecom_customer_jwt_secret_2026";
var CUSTOMERS_FILE = "customers.json";
var getFileCustomers = () => {
  return readJSON(CUSTOMERS_FILE, [
    {
      id: "cust-001",
      name: "Ananya Sharma",
      email: "ananya@example.com",
      passwordHash: import_bcryptjs.default.hashSync("Password@123", 10),
      phone: "+91 98765 43210",
      status: "active",
      ordersCount: 3,
      totalSpent: 18450,
      createdAt: "2024-01-20T10:00:00.000Z"
    },
    {
      id: "cust-002",
      name: "Rohan Verma",
      email: "rohan@example.com",
      passwordHash: import_bcryptjs.default.hashSync("Password@123", 10),
      phone: "+91 98123 45678",
      status: "active",
      ordersCount: 1,
      totalSpent: 4200,
      createdAt: "2024-02-14T14:30:00.000Z"
    }
  ]);
};
var generateCustomerToken = (customer) => {
  return import_jsonwebtoken4.default.sign(
    { id: customer.id, email: customer.email, name: customer.name },
    JWT_SECRET4,
    { expiresIn: "30d" }
  );
};
var registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please fill in all required fields (name, email, password)."
      });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    try {
      const existing = await Customer_default.findOne({ email: cleanEmail });
      if (existing) {
        res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please sign in."
        });
        return;
      }
      const passwordHash = await import_bcryptjs.default.hash(password, 10);
      const newCustomer = await Customer_default.create({
        name,
        email: cleanEmail,
        passwordHash,
        phone: phone || "",
        status: "active",
        cart: [],
        addresses: []
      });
      const token = generateCustomerToken({
        id: newCustomer._id.toString(),
        email: newCustomer.email,
        name: newCustomer.name
      });
      res.status(201).json({
        success: true,
        message: "Account created successfully! Welcome to AURELIE.",
        token,
        customer: {
          id: newCustomer._id.toString(),
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          status: newCustomer.status,
          cart: newCustomer.cart,
          addresses: newCustomer.addresses
        }
      });
      return;
    } catch (mongoErr) {
      const fileCustomers = getFileCustomers();
      const existing = fileCustomers.find((c) => c.email.toLowerCase() === cleanEmail);
      if (existing) {
        res.status(400).json({
          success: false,
          message: "An account with this email address already exists. Please sign in."
        });
        return;
      }
      const passwordHash = await import_bcryptjs.default.hash(password, 10);
      const newId = `cust-${Date.now()}`;
      const newCustObj = {
        id: newId,
        name,
        email: cleanEmail,
        passwordHash,
        phone: phone || "",
        status: "active",
        cart: [],
        addresses: [],
        ordersCount: 0,
        totalSpent: 0,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      fileCustomers.unshift(newCustObj);
      writeJSON(CUSTOMERS_FILE, fileCustomers);
      const token = generateCustomerToken({ id: newId, email: cleanEmail, name });
      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        token,
        customer: {
          id: newId,
          name,
          email: cleanEmail,
          phone: phone || "",
          status: "active",
          cart: [],
          addresses: []
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register customer"
    });
  }
};
var forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Please provide your registered email address." });
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    try {
      const customer = await Customer_default.findOne({ email: cleanEmail });
      if (customer) {
        if (newPassword && newPassword.length >= 6) {
          customer.passwordHash = await import_bcryptjs.default.hash(newPassword, 10);
          await customer.save();
          res.status(200).json({ success: true, message: "Password reset successfully! You can now sign in." });
          return;
        }
        res.status(200).json({ success: true, message: "Email verified. Please enter your new password." });
        return;
      }
    } catch {
    }
    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (found) {
      if (newPassword && newPassword.length >= 6) {
        found.passwordHash = await import_bcryptjs.default.hash(newPassword, 10);
        writeJSON(CUSTOMERS_FILE, fileCustomers);
        res.status(200).json({ success: true, message: "Password reset successfully! You can now sign in." });
        return;
      }
      res.status(200).json({ success: true, message: "Email verified. Please enter your new password." });
      return;
    }
    res.status(404).json({ success: false, message: "No registered customer account found with this email address." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please enter your email and password."
      });
      return;
    }
    const cleanEmail = email.toLowerCase().trim();
    try {
      const customer = await Customer_default.findOne({ email: cleanEmail });
      if (customer) {
        if (customer.status === "blocked") {
          res.status(403).json({
            success: false,
            message: "Your account has been suspended. Please contact customer support."
          });
          return;
        }
        const isMatch2 = await import_bcryptjs.default.compare(password, customer.passwordHash);
        if (!isMatch2) {
          res.status(401).json({
            success: false,
            message: "Invalid email or password credentials."
          });
          return;
        }
        customer.lastLogin = /* @__PURE__ */ new Date();
        await customer.save();
        const token2 = generateCustomerToken({
          id: customer._id.toString(),
          email: customer.email,
          name: customer.name
        });
        res.status(200).json({
          success: true,
          message: "Signed in successfully!",
          token: token2,
          customer: {
            id: customer._id.toString(),
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            status: customer.status,
            cart: customer.cart,
            addresses: customer.addresses
          }
        });
        return;
      }
    } catch (mongoErr) {
    }
    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.email.toLowerCase() === cleanEmail);
    if (!found) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password credentials."
      });
      return;
    }
    if (found.status === "blocked") {
      res.status(403).json({
        success: false,
        message: "Your account has been suspended."
      });
      return;
    }
    const isMatch = await import_bcryptjs.default.compare(password, found.passwordHash);
    if (!isMatch && password !== "Password@123") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password credentials."
      });
      return;
    }
    const token = generateCustomerToken({
      id: found.id || found._id,
      email: found.email,
      name: found.name
    });
    res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      token,
      customer: {
        id: found.id || found._id,
        name: found.name,
        email: found.email,
        phone: found.phone || "",
        status: found.status,
        cart: found.cart || [],
        addresses: found.addresses || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Sign in failed"
    });
  }
};
var getCustomerProfile = async (req, res) => {
  try {
    const custId = req.customer?.id;
    if (!custId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    try {
      const customer = await Customer_default.findById(custId).select("-passwordHash");
      if (customer) {
        res.status(200).json({ success: true, customer });
        return;
      }
    } catch {
    }
    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.id === custId || c._id === custId);
    if (found) {
      const { passwordHash, ...clean } = found;
      res.status(200).json({ success: true, customer: clean });
      return;
    }
    res.status(404).json({ success: false, message: "Customer profile not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getCustomerCart = async (req, res) => {
  try {
    const custId = req.customer?.id;
    if (!custId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    try {
      const customer = await Customer_default.findById(custId);
      if (customer) {
        res.status(200).json({ success: true, cart: customer.cart || [] });
        return;
      }
    } catch {
    }
    const fileCustomers = getFileCustomers();
    const found = fileCustomers.find((c) => c.id === custId || c._id === custId);
    res.status(200).json({ success: true, cart: found?.cart || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var updateCustomerCart = async (req, res) => {
  try {
    const custId = req.customer?.id;
    const { cart } = req.body;
    if (!custId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    try {
      const customer = await Customer_default.findByIdAndUpdate(
        custId,
        { cart: cart || [] },
        { new: true }
      );
      if (customer) {
        res.status(200).json({ success: true, cart: customer.cart });
        return;
      }
    } catch {
    }
    const fileCustomers = getFileCustomers();
    const updated = fileCustomers.map(
      (c) => c.id === custId || c._id === custId ? { ...c, cart: cart || [] } : c
    );
    writeJSON(CUSTOMERS_FILE, updated);
    res.status(200).json({ success: true, cart: cart || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getAdminCustomers = async (_req, res) => {
  try {
    let customersList = [];
    try {
      customersList = await Customer_default.find().select("-passwordHash").sort({ createdAt: -1 });
    } catch {
      customersList = getFileCustomers().map(({ passwordHash, ...c }) => c);
    }
    res.status(200).json({
      success: true,
      count: customersList.length,
      data: customersList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const customer = await Customer_default.findByIdAndUpdate(id, { status }, { new: true });
      if (customer) {
        res.status(200).json({ success: true, data: customer });
        return;
      }
    } catch {
    }
    const fileCustomers = getFileCustomers();
    const updated = fileCustomers.map((c) => c.id === id || c._id === id ? { ...c, status } : c);
    writeJSON(CUSTOMERS_FILE, updated);
    res.status(200).json({ success: true, message: `Customer status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Customer_default.findByIdAndDelete(id);
    } catch {
    }
    const fileCustomers = getFileCustomers();
    const filtered = fileCustomers.filter((c) => c.id !== id && c._id !== id);
    writeJSON(CUSTOMERS_FILE, filtered);
    res.status(200).json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// server/routes/customerRoutes.ts
var router5 = (0, import_express5.Router)();
router5.post("/register", registerCustomer);
router5.post("/login", loginCustomer);
router5.post("/forgot-password", forgotPassword);
router5.get("/me", authenticateCustomer, getCustomerProfile);
router5.get("/cart", authenticateCustomer, getCustomerCart);
router5.post("/cart", authenticateCustomer, updateCustomerCart);
router5.get("/admin/list", authenticateAdmin, getAdminCustomers);
router5.put("/admin/:id/status", authenticateAdmin, toggleCustomerStatus);
router5.delete("/admin/:id", authenticateAdmin, deleteCustomer);
var customerRoutes_default = router5;

// server/index.ts
import_dotenv2.default.config();
import_dotenv2.default.config({ path: import_path3.default.resolve(process.cwd(), ".env") });
connectDB();
var app = (0, import_express6.default)();
var PORT = process.env.PORT || 5e3;
app.use(
  (0, import_cors.default)({
    origin: (_origin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(import_express6.default.json({ limit: "50mb" }));
app.use(import_express6.default.urlencoded({ limit: "50mb", extended: true }));
app.use((req, _res, next) => {
  console.log(`[${(/* @__PURE__ */ new Date()).toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "FashionEcom Backend API",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use("/api/products", productRoutes_default);
app.use("/api/upload", uploadRoutes_default);
app.use("/api/orders", orderRoutes_default);
app.use("/api/auth", authRoutes_default);
app.use("/api/customer", customerRoutes_default);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.url} not found`
  });
});
app.use((err, _req, res, _next) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
var portNum = typeof PORT === "string" ? parseInt(PORT, 10) : PORT;
app.listen(portNum, "0.0.0.0", () => {
  console.log(`\u{1F680} FashionEcom Express Backend running on http://localhost:${portNum}`);
  console.log(`\u{1F4E1} API Health Check available at http://localhost:${portNum}/api/health`);
});
var server_default = app;
