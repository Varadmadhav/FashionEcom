import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Search,
  Filter,
  ShieldCheck,
  UserPlus,
  Key,
  Trash2,
  Lock,
  Mail,
  CheckCircle,
  Tag,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  X,
  Pencil
} from "lucide-react";
import { Product } from "@/data/products";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminUser } from "@/utils/adminJwt";
import { useProductStore } from "@/context/ProductStoreContext";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/utils/cloudinary";
import { uploadImageApi, API_BASE } from "@/utils/api";
import CloudinaryImage from "../CloudinaryImage";

// ----------------------------------------------------
// 1. PRODUCTS TAB VIEW
// ----------------------------------------------------
export function ProductsTabView() {
  const { allProducts, addProduct, removeProduct, updateProduct } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states (shared for add & edit)
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState<Product["category"]>("dresses");
  const [collection, setCollection] = useState("Heritage");
  const [description, setDescription] = useState("");
  
  const [mainImgUrl, setMainImgUrl] = useState("");
  const [hoverImgUrl, setHoverImgUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");

  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");

  const [sizeInput, setSizeInput] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);

  const [finish, setFinish] = useState("Polished");
  const [estimatedDelivery, setEstimatedDelivery] = useState("3-5 Days");
  
  const [badges, setBadges] = useState<string[]>(["New Arrival"]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [uploadingStatus, setUploadingStatus] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStatus("Uploading file directly to Cloudinary...");

    // 1. Primary: Direct Client Unsigned Cloudinary Upload (Uses preset yelvdumu)
    if (isCloudinaryConfigured()) {
      try {
        const cldUrl = await uploadToCloudinary(file);
        if (cldUrl && cldUrl.includes("res.cloudinary.com")) {
          setter(cldUrl);
          setUploadingStatus(null);
          return;
        }
      } catch (cldErr: any) {
        console.warn("Direct Cloudinary upload notice:", cldErr?.message);
      }
    }

    // 2. Secondary: Backend REST API upload endpoint (/api/upload)
    try {
      const url = await uploadImageApi(file);
      if (url && (url.includes("res.cloudinary.com") || !url.startsWith("data:"))) {
        setter(url);
        setUploadingStatus(null);
        return;
      }
    } catch (apiErr) {
      console.warn("Backend API upload notice:", apiErr);
    }

    // 3. Fallback to FileReader base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
      setUploadingStatus(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || galleryUrls.length >= 6) return;

    setUploadingStatus("Uploading gallery file directly to Cloudinary...");

    // 1. Primary: Direct Client Unsigned Cloudinary Upload (Uses preset yelvdumu)
    if (isCloudinaryConfigured()) {
      try {
        const cldUrl = await uploadToCloudinary(file);
        if (cldUrl && cldUrl.includes("res.cloudinary.com")) {
          setGalleryUrls((prev) => [...prev, cldUrl]);
          setUploadingStatus(null);
          return;
        }
      } catch (cldErr: any) {
        console.warn("Direct Cloudinary gallery upload notice:", cldErr?.message);
      }
    }

    // 2. Secondary: Backend REST API upload endpoint (/api/upload)
    try {
      const url = await uploadImageApi(file);
      if (url && (url.includes("res.cloudinary.com") || !url.startsWith("data:"))) {
        setGalleryUrls((prev) => [...prev, url]);
        setUploadingStatus(null);
        return;
      }
    } catch (apiErr) {
      console.warn("Backend API gallery upload notice:", apiErr);
    }

    // 3. Fallback to FileReader base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setGalleryUrls((prev) => [...prev, reader.result as string]);
      setUploadingStatus(null);
    };
    reader.readAsDataURL(file);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!sku || sku.startsWith("AUR-")) {
      const prefix = val.substring(0, 3).toUpperCase() || "XXX";
      const randomNum = Math.floor(100 + Math.random() * 900);
      setSku(`AUR-${prefix}-${randomNum}`);
    }
  };

  const resetForm = () => {
    setName(""); setSku(""); setCategory("dresses"); setCollection("Heritage"); setDescription("");
    setMainImgUrl(""); setHoverImgUrl(""); setGalleryUrls([]); setNewGalleryUrl("");
    setPrice(""); setOriginalPrice(""); setStockQuantity(""); setLowStockThreshold("5");
    setSizes([]); setSizeInput(""); setFinish("Polished"); setEstimatedDelivery("3-5 Days");
    setBadges(["New Arrival"]); setOccasions([]);
    setEditingProductId(null);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProductId(prod.id);
    setName(prod.name);
    setSku(prod.sku);
    setCategory(prod.category);
    setCollection(prod.collection || "Heritage");
    setDescription(prod.description || "");
    setMainImgUrl(prod.images[0] || "");
    setHoverImgUrl(prod.images[1] || "");
    setGalleryUrls(prod.galleryImages || []);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : "");
    setStockQuantity(prod.stockQuantity.toString());
    setLowStockThreshold(prod.lowStockThreshold ? prod.lowStockThreshold.toString() : "5");
    setSizes(prod.sizes || []);
    setFinish(prod.finish || "Polished");
    setEstimatedDelivery(prod.estimatedDelivery || "3-5 Days");
    setBadges(prod.badges || []);
    setOccasions(prod.occasions || []);
    setIsEditModalOpen(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stockQuantity) return;

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      sku: sku || `AUR-XXX-${Math.floor(100 + Math.random() * 900)}`,
      category,
      collection,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: [
        mainImgUrl || "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80",
        hoverImgUrl || mainImgUrl || "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      ],
      galleryImages: galleryUrls,
      sizes,
      description,
      details: [
        `${collection} collection item`,
        `Finish: ${finish}`,
        `Estimated delivery: ${estimatedDelivery}`
      ],
      newArrival: true,
      featured: badges.includes("Best Seller"),
      availability: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      finish,
      estimatedDelivery,
      badges: badges.length > 0 ? badges : ["New Arrival"],
      occasions,
      addedAt: new Date().toISOString(),
    };

    await addProduct(newProduct);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId || !name || !price || !stockQuantity) return;

    const updatedProduct: Partial<Product> = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      sku,
      category,
      collection,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: [
        mainImgUrl || "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80",
        hoverImgUrl || mainImgUrl || "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      ],
      galleryImages: galleryUrls,
      sizes,
      description,
      newArrival: badges.includes("New Arrival") || true,
      featured: badges.includes("Best Seller"),
      availability: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      finish,
      estimatedDelivery,
      badges: badges.length > 0 ? badges : ["New Arrival"],
      occasions,
    };

    await updateProduct(editingProductId, updatedProduct);
    resetForm();
    setIsEditModalOpen(false);
  };

  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reusable Form Fields Component for both Add & Edit Modals
  const renderProductFormFields = () => (
    <>
      {/* BASIC INFORMATION */}
      <fieldset className="border border-brand-border/40 rounded-xl p-4">
        <legend className="text-[#B8860B] uppercase tracking-widest text-[11px] font-bold px-2">Basic Information</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-brand-espresso mb-1 font-semibold">Product Name *</label>
            <input type="text" required value={name} onChange={handleNameChange} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">SKU</label>
            <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20 font-mono text-xs" />
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as Product["category"])} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20">
              <option value="dresses">Dresses</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="coords">Co-ords</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-brand-espresso mb-1 font-semibold">Collection</label>
            <select value={collection} onChange={e => setCollection(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20">
              <option value="Heritage">Heritage</option>
              <option value="Summer Edit">Summer Edit</option>
              <option value="Essentials">Essentials</option>
              <option value="Occasions">Occasions</option>
              <option value="Workwear">Workwear</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-brand-espresso mb-1 font-semibold">Short Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20 resize-none"></textarea>
          </div>
        </div>
      </fieldset>

      {/* PRODUCT IMAGES */}
      <fieldset className="border border-brand-border/40 rounded-xl p-4">
        <legend className="text-[#B8860B] uppercase tracking-widest text-[11px] font-bold px-2">Product Images</legend>
        {uploadingStatus && (
          <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2 animate-pulse">
            <span className="font-semibold">{uploadingStatus}</span>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Main Image (URL or Upload)</label>
            <div className="flex gap-2">
              <input type="text" placeholder="https://..." value={mainImgUrl} onChange={e => setMainImgUrl(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
              <label className="px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border/50 cursor-pointer flex items-center justify-center hover:bg-brand-border/50 transition-colors">
                <span>Choose File</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setMainImgUrl)} />
              </label>
            </div>
            {mainImgUrl && (
              <div className="mt-2 w-16 h-20 rounded-lg overflow-hidden border border-brand-border/40">
                <CloudinaryImage src={mainImgUrl} alt="Main preview" width={200} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Hover Image (URL or Upload)</label>
            <div className="flex gap-2">
              <input type="text" placeholder="https://..." value={hoverImgUrl} onChange={e => setHoverImgUrl(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
              <label className="px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border/50 cursor-pointer flex items-center justify-center hover:bg-brand-border/50 transition-colors">
                <span>Choose File</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setHoverImgUrl)} />
              </label>
            </div>
            {hoverImgUrl && (
              <div className="mt-2 w-16 h-20 rounded-lg overflow-hidden border border-brand-border/40">
                <CloudinaryImage src={hoverImgUrl} alt="Hover preview" width={200} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold flex justify-between">
              <span>Gallery Images ({galleryUrls.length}/6)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="https://..." value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" disabled={galleryUrls.length >= 6} />
              <button type="button" onClick={() => { if(newGalleryUrl) { setGalleryUrls([...galleryUrls, newGalleryUrl]); setNewGalleryUrl(""); } }} disabled={galleryUrls.length >= 6} className="px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border/50 cursor-pointer hover:bg-brand-border/50 transition-colors">Add URL</button>
              <label className={`px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border/50 flex items-center justify-center transition-colors ${galleryUrls.length >= 6 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-brand-border/50'}`}>
                <span>Upload File</span>
                <input type="file" accept="image/*" className="hidden" disabled={galleryUrls.length >= 6} onChange={handleGalleryFileUpload} />
              </label>
            </div>
            {galleryUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {galleryUrls.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg border border-brand-border/50 overflow-hidden group">
                    <CloudinaryImage src={url} alt="" width={200} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setGalleryUrls(galleryUrls.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/80 p-0.5 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </fieldset>

      {/* PRICING & INVENTORY */}
      <fieldset className="border border-brand-border/40 rounded-xl p-4">
        <legend className="text-[#B8860B] uppercase tracking-widest text-[11px] font-bold px-2">Pricing & Inventory</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Price (₹) *</label>
            <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Original Price (₹)</label>
            <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="For sale items" className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Stock Quantity *</label>
            <input type="number" required value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Low Stock Alert Threshold</label>
            <input type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
          </div>
        </div>
      </fieldset>

      {/* AVAILABLE SIZES */}
      <fieldset className="border border-brand-border/40 rounded-xl p-4">
        <legend className="text-[#B8860B] uppercase tracking-widest text-[11px] font-bold px-2">Available Sizes</legend>
        <div className="flex gap-2 mb-2">
          <input type="text" placeholder="e.g. 2.2, 2.4, S, M, L, XL" value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), sizeInput && !sizes.includes(sizeInput) && (setSizes([...sizes, sizeInput]), setSizeInput('')))} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20" />
          <button type="button" onClick={() => { if(sizeInput && !sizes.includes(sizeInput)) { setSizes([...sizes, sizeInput]); setSizeInput(""); } }} className="px-4 py-2.5 bg-brand-surface rounded-xl border border-brand-border/50 cursor-pointer hover:bg-brand-border/50 transition-colors">Add Size</button>
        </div>
        {sizes.length > 0 ? (
          <div className="flex gap-2 flex-wrap mt-2">
            {sizes.map(s => (
              <div key={s} className="flex items-center gap-1 bg-brand-surface px-2.5 py-1 rounded-md border border-brand-border/50 text-xs">
                <span className="font-semibold text-brand-espresso">{s}</span>
                <button type="button" onClick={() => setSizes(sizes.filter(size => size !== s))} className="text-brand-muted hover:text-rose-600"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-brand-muted mt-1">No sizes added. Product will display without size requirement.</p>
        )}
      </fieldset>

      {/* PRODUCT SPECIFICATIONS & BADGES */}
      <fieldset className="border border-brand-border/40 rounded-xl p-4">
        <legend className="text-[#B8860B] uppercase tracking-widest text-[11px] font-bold px-2">Product Specifications & Badges</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Finish</label>
            <select value={finish} onChange={e => setFinish(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20">
              <option value="Polished">Polished</option>
              <option value="Matte">Matte</option>
              <option value="Raw">Raw</option>
              <option value="Hand-finished">Hand-finished</option>
              <option value="Garment-washed">Garment-washed</option>
            </select>
          </div>
          <div>
            <label className="block text-brand-espresso mb-1 font-semibold">Estimated Delivery</label>
            <select value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20">
              <option value="3-5 Days">3-5 Days</option>
              <option value="5-7 Days">5-7 Days</option>
              <option value="7-10 Days">7-10 Days</option>
              <option value="10-14 Days">10-14 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-brand-espresso mb-2 font-semibold">Badges</label>
            <div className="flex flex-col gap-2">
              {["Best Seller", "New Arrival", "On Sale"].map(badge => (
                <label key={badge} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={badges.includes(badge)} onChange={() => setBadges(badges.includes(badge) ? badges.filter(b => b !== badge) : [...badges, badge])} className="rounded border-brand-border text-brand-espresso focus:ring-brand-espresso" />
                  <span>{badge}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-brand-espresso mb-2 font-semibold">Occasions</label>
            <div className="flex flex-col gap-2">
              {["Daily Wear", "Office Wear", "Party Wear", "Wedding", "Festive"].map(occ => (
                <label key={occ} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={occasions.includes(occ)} onChange={() => setOccasions(occasions.includes(occ) ? occasions.filter(o => o !== occ) : [...occasions, occ])} className="rounded border-brand-border text-brand-espresso focus:ring-brand-espresso" />
                  <span>{occ}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-5 rounded-2xl border border-brand-border/30 shadow-xs">
        <div>
          <h2 className="font-serif text-2xl text-brand-espresso font-normal">
            Product Catalog
          </h2>
          <p className="font-sans text-xs text-brand-muted mt-0.5">
            Manage store inventory, prices, edits, and collection categories
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-[#5C1D24] text-white px-5 py-2.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#4A151B] transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 text-xs rounded-xl border border-brand-border/40 focus:outline-none focus:border-brand-espresso transition-colors text-brand-fg"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-brand-muted" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white px-4 py-2.5 text-xs rounded-xl border border-brand-border/40 focus:outline-none focus:border-brand-espresso text-brand-espresso font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="dresses">Dresses</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="coords">Coords</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-brand-border/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bg/80 border-b border-brand-border/30 text-brand-muted font-sans uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Collection</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Stock</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-brand-espresso">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <CloudinaryImage
                        src={prod.images[0]}
                        alt={prod.name}
                        width={150}
                        className="w-11 h-11 rounded-lg object-cover bg-brand-surface border border-brand-border/30"
                      />
                      <div>
                        <p className="font-medium text-brand-espresso">{prod.name}</p>
                        <p className="text-[10px] text-brand-muted font-mono">{prod.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 capitalize font-sans text-brand-muted">
                    {prod.category}
                  </td>
                  <td className="py-4 px-4 font-sans text-brand-muted">
                    {prod.collection}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold">
                    ₹{prod.price.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 font-mono text-brand-muted">
                    {prod.stockQuantity}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                        prod.availability
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {prod.availability ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="text-brand-muted hover:text-brand-espresso transition-colors p-1.5 rounded-lg hover:bg-brand-surface cursor-pointer"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                            await removeProduct(prod.id);
                          }
                        }}
                        className="text-brand-muted hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Portal Rendered) */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-brand-border/40 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-brand-border/30 pb-4 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#5C1D24]/10 text-[#5C1D24] flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-brand-espresso font-normal">Add to Catalogue</h3>
                    <p className="text-[11px] text-brand-muted">Enter comprehensive product details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-brand-surface text-brand-muted hover:text-brand-espresso flex items-center justify-center transition-colors text-base cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6 text-xs pb-4">
                {renderProductFormFields()}

                <div className="pt-4 border-t border-brand-border/20 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-brand-border/40 text-brand-muted hover:text-brand-fg font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#5C1D24] text-white font-semibold uppercase tracking-wider hover:bg-[#4A151B] transition-colors cursor-pointer"
                  >
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Edit Product Modal (Portal Rendered) */}
      {isEditModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-brand-border/40 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-brand-border/30 pb-4 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 text-[#B8860B] flex items-center justify-center">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-brand-espresso font-normal">Edit Product</h3>
                    <p className="text-[11px] text-brand-muted">Update product details across the store catalog</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-brand-surface text-brand-muted hover:text-brand-espresso flex items-center justify-center transition-colors text-base cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-6 text-xs pb-4">
                {renderProductFormFields()}

                <div className="pt-4 border-t border-brand-border/20 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-brand-border/40 text-brand-muted hover:text-brand-fg font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#5C1D24] text-white font-semibold uppercase tracking-wider hover:bg-[#4A151B] transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

// ----------------------------------------------------
// 2. ORDERS TAB VIEW
// ----------------------------------------------------
export function OrdersTabView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("aurelie_admin_jwt");
      const res = await fetch(`${API_BASE}/orders`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch admin orders:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistically update React state immediately
    setOrders((prev) =>
      prev.map((o) => ((o.id === id || o._id === id) ? { ...o, status: newStatus } : o))
    );

    try {
      const token = localStorage.getItem("aurelie_admin_jwt");
      await fetch(`${API_BASE}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (e) {
      console.error("Failed to update order status:", e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const custName = o.customerName || o.customer || "";
    const emailStr = o.email || "";
    const idStr = o.id || o._id || "";
    const matchesSearch =
      idStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      custName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || (o.status || "").toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-5 rounded-2xl border border-brand-border/30 shadow-xs">
        <div>
          <h2 className="font-serif text-2xl text-brand-espresso font-normal">
            Orders Management
          </h2>
          <p className="font-sans text-xs text-brand-muted mt-0.5">
            Monitor and process store transactions, customer fulfillments and status updates
          </p>
        </div>
        <div className="px-3 py-1.5 bg-brand-bg rounded-xl text-xs font-mono text-brand-espresso font-semibold border border-brand-border/30">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-10 pr-4 py-2.5 text-xs rounded-xl border border-brand-border/40 focus:outline-none focus:border-brand-espresso text-brand-fg"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-brand-muted" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white px-4 py-2.5 text-xs rounded-xl border border-brand-border/40 focus:outline-none focus:border-brand-espresso text-brand-espresso font-medium cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="packed">Packed</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-brand-border/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bg/80 border-b border-brand-border/30 text-brand-muted font-sans uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total</th>
                <th className="py-3.5 px-4 font-semibold">Payment</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-brand-espresso">
              {filteredOrders.map((ord) => {
                const id = ord.id || ord._id;
                const custName = ord.customerName || ord.customer || "Guest Customer";
                const itemsSummary = Array.isArray(ord.items)
                  ? ord.items.map((i: any) => `${i.name} (${i.size}) x${i.quantity}`).join(", ")
                  : ord.items || "1 Item";

                return (
                  <tr key={id} className="hover:bg-brand-bg/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-semibold text-brand-espresso">
                      #{id}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-brand-espresso">{custName}</p>
                      <p className="text-[10px] text-brand-muted">{ord.email}</p>
                    </td>
                    <td className="py-4 px-4 text-brand-muted max-w-xs truncate font-mono text-[11px]">
                      {itemsSummary}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-700">
                      ₹{(ord.total || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-brand-muted">
                      {ord.paymentMethod || "COD"}
                    </td>
                    <td className="py-4 px-4 text-brand-muted font-sans">
                      {new Date(ord.date || ord.createdAt || Date.now()).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={ord.status || "Pending"}
                        onChange={(e) => handleUpdateStatus(id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ord.status === "Out for Delivery"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : ord.status === "Packed"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : ord.status === "Cancelled"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Packed">Packed</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. CUSTOMERS TAB VIEW
// ----------------------------------------------------
export function CustomersTabView() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("aurelie_admin_jwt");
      const res = await fetch(`${API_BASE}/customer/admin/list`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCustomers(data.data);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch admin customers list:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      const token = localStorage.getItem("aurelie_admin_jwt");
      await fetch(`${API_BASE}/customer/admin/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchCustomers();
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer account?")) return;
    try {
      const token = localStorage.getItem("aurelie_admin_jwt");
      await fetch(`${API_BASE}/customer/admin/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      fetchCustomers();
    } catch (e) {
      console.error("Failed to delete customer:", e);
    }
  };

  const sampleFallbackCustomers = [
    { id: "cust-001", name: "Ananya Sharma", email: "ananya@example.com", ordersCount: 3, totalSpent: 18450, status: "active", createdAt: "2026-01-12" },
    { id: "cust-002", name: "Rohan Verma", email: "rohan@example.com", ordersCount: 1, totalSpent: 4200, status: "active", createdAt: "2026-02-14" },
    { id: "cust-003", name: "Aaria Kapoor", email: "aaria@example.com", ordersCount: 5, totalSpent: 42500, status: "active", createdAt: "2025-11-20" },
  ];

  const displayList = customers.length > 0 ? customers : sampleFallbackCustomers;

  const filteredCustomers = displayList.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.id || c._id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-5 rounded-2xl border border-brand-border/30 shadow-xs">
        <div>
          <h2 className="font-serif text-2xl text-brand-espresso font-normal">
            Customer Directory
          </h2>
          <p className="font-sans text-xs text-brand-muted mt-0.5">
            Registered customer accounts, phone numbers, purchasing metrics and status
          </p>
        </div>
        <div className="px-3 py-1.5 bg-brand-bg rounded-xl text-xs font-mono text-brand-espresso font-semibold border border-brand-border/30">
          Total Customers: {displayList.length}
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          type="text"
          placeholder="Search customers by name, email, phone number or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white pl-10 pr-4 py-2.5 text-xs rounded-xl border border-brand-border/40 focus:outline-none focus:border-brand-espresso text-brand-fg"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-brand-border/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bg/80 border-b border-brand-border/30 text-brand-muted font-sans uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Phone Number</th>
                <th className="py-3.5 px-4 font-semibold">Customer ID</th>
                <th className="py-3.5 px-4 font-semibold">Orders</th>
                <th className="py-3.5 px-4 font-semibold">Total Spent</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-brand-espresso">
              {filteredCustomers.map((c) => {
                const id = c.id || c._id;
                const isBlocked = c.status === "blocked";
                return (
                  <tr key={id} className="hover:bg-brand-bg/40 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-medium text-brand-espresso">{c.name}</p>
                      <p className="text-[10px] text-brand-muted">{c.email}</p>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-brand-espresso">
                      {c.phone || "—"}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-brand-muted">
                      {id}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">
                      {c.ordersCount || 0}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-emerald-700">
                      ₹{(c.totalSpent || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          isBlocked
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(id, c.status || "active")}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition ${
                            isBlocked
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition"
                          title="Delete customer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 4. ADMINS TAB VIEW
// ----------------------------------------------------
export function AdminsTabView() {
  const { adminList, addAdmin, removeAdmin } = useAdminAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new admin
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<AdminUser["role"]>("Inventory Admin");

  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newName) return;

    addAdmin({
      email: newEmail,
      password: newPassword,
      name: newName,
      role: newRole,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    });

    setNewEmail("");
    setNewPassword("");
    setNewName("");
    setNewRole("Inventory Admin");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-5 rounded-2xl border border-brand-border/30 shadow-xs">
        <div>
          <h2 className="font-serif text-2xl text-brand-espresso font-normal">
            Admin Accounts
          </h2>
          <p className="font-sans text-xs text-brand-muted mt-0.5">
            Manage administrative credentials, system roles and permissions
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#5C1D24] text-white px-5 py-2.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider hover:bg-[#4A151B] transition-colors shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Admin User</span>
        </button>
      </div>

      {/* Admins Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-brand-border/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-bg/80 border-b border-brand-border/30 text-brand-muted font-sans uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6 font-semibold">User</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Created Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-brand-espresso">
              {adminList.map((adm: AdminUser) => (
                <tr key={adm.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#5C1D24]/10 text-[#5C1D24] flex items-center justify-center font-bold font-serif">
                        {adm.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-brand-espresso">{adm.name}</p>
                        <p className="text-[10px] text-brand-muted">{adm.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-sans font-medium">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] ${
                        adm.role === "Super Admin"
                          ? "bg-[#5C1D24]/10 text-[#5C1D24] font-semibold"
                          : adm.role === "Store Manager"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {adm.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-brand-muted font-sans">
                    {adm.createdAt}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {adm.role !== "Super Admin" && (
                      <button
                        onClick={() => removeAdmin(adm.id)}
                        className="text-brand-muted hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Remove Admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal (Portal Rendered) */}
      {isAddModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-brand-border/40 space-y-6 animate-scaleUp my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-brand-border/30 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#5C1D24]/10 text-[#5C1D24] flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-brand-espresso font-normal">Add Admin Account</h3>
                    <p className="text-[11px] text-brand-muted">Grant admin portal access</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-brand-surface text-brand-muted hover:text-brand-espresso flex items-center justify-center transition-colors text-base cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddAdminSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-brand-espresso mb-1 font-semibold">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20"
                  />
                </div>

                <div>
                  <label className="block text-brand-espresso mb-1 font-semibold">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@aurelie.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20"
                  />
                </div>

                <div>
                  <label className="block text-brand-espresso mb-1 font-semibold">Initial Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20"
                  />
                </div>

                <div>
                  <label className="block text-brand-espresso mb-1 font-semibold">Role *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminUser["role"])}
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/20 cursor-pointer"
                  >
                    <option value="Inventory Admin">Inventory Admin (Manage products & catalog)</option>
                    <option value="Store Manager">Store Manager (Manage orders & customers)</option>
                    <option value="Super Admin">Super Admin (Full control)</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-brand-border/20 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-brand-border/40 text-brand-muted hover:text-brand-fg font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#5C1D24] text-white font-semibold uppercase tracking-wider hover:bg-[#4A151B] transition-colors cursor-pointer"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

