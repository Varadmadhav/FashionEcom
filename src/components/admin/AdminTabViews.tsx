import React, { useState } from "react";
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
import { uploadImageApi } from "@/utils/api";
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
  
  const [badges, setBadges] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [uploadingStatus, setUploadingStatus] = useState<string | null>(null);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStatus("Uploading image to Cloudinary...");

    try {
      // 1. Try Backend REST API upload endpoint (/api/upload)
      const url = await uploadImageApi(file);
      setter(url);
      setUploadingStatus(null);
      return;
    } catch (apiErr) {
      console.warn("Backend API upload failed, trying direct Cloudinary upload:", apiErr);
    }

    if (isCloudinaryConfigured()) {
      try {
        // 2. Direct client-side unsigned Cloudinary upload fallback
        const cldUrl = await uploadToCloudinary(file);
        setter(cldUrl);
        setUploadingStatus(null);
        return;
      } catch (cldErr: any) {
        console.warn("Direct Cloudinary upload failed, falling back to local file reader:", cldErr);
      }
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

    setUploadingStatus("Uploading gallery image to Cloudinary...");

    try {
      // 1. Try Backend REST API upload endpoint (/api/upload)
      const url = await uploadImageApi(file);
      setGalleryUrls((prev) => [...prev, url]);
      setUploadingStatus(null);
      return;
    } catch (apiErr) {
      console.warn("Backend API gallery upload failed, trying direct Cloudinary upload:", apiErr);
    }

    if (isCloudinaryConfigured()) {
      try {
        // 2. Direct client-side unsigned Cloudinary upload fallback
        const cldUrl = await uploadToCloudinary(file);
        setGalleryUrls((prev) => [...prev, cldUrl]);
        setUploadingStatus(null);
        return;
      } catch (cldErr: any) {
        console.warn("Direct Cloudinary gallery upload failed, falling back to local file reader:", cldErr);
      }
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
    setBadges([]); setOccasions([]);
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

  const handleAddProduct = (e: React.FormEvent) => {
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
        hoverImgUrl || "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      ],
      galleryImages: galleryUrls,
      sizes,
      description,
      details: [
        `${collection} collection item`,
        `Finish: ${finish}`,
        `Estimated delivery: ${estimatedDelivery}`
      ],
      newArrival: badges.includes("New Arrival"),
      featured: badges.includes("Best Seller"),
      availability: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      finish,
      estimatedDelivery,
      badges,
      occasions,
      addedAt: new Date().toISOString(),
    };

    addProduct(newProduct);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
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
        hoverImgUrl || "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      ],
      galleryImages: galleryUrls,
      sizes,
      description,
      newArrival: badges.includes("New Arrival"),
      featured: badges.includes("Best Seller"),
      availability: Number(stockQuantity) > 0,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      finish,
      estimatedDelivery,
      badges,
      occasions,
    };

    updateProduct(editingProductId, updatedProduct);
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
                        onClick={() => removeProduct(prod.id)}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const sampleOrders = [
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

  const filteredOrders = sampleOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || o.status.toLowerCase() === selectedStatus.toLowerCase();
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
            Monitor and process store transactions and customer fulfillments
          </p>
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
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
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
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-brand-espresso">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-6 font-mono font-semibold text-brand-espresso">
                    {ord.id}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-brand-espresso">{ord.customer}</p>
                    <p className="text-[10px] text-brand-muted">{ord.email}</p>
                  </td>
                  <td className="py-4 px-4 text-brand-muted max-w-xs truncate">
                    {ord.items}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold">
                    ₹{ord.total.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-brand-muted font-sans">
                    {ord.date}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                        ord.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : ord.status === "Shipped"
                          ? "bg-blue-50 text-blue-700"
                          : ord.status === "Processing"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
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
  const [searchTerm, setSearchTerm] = useState("");

  const sampleCustomers = [
    {
      id: "CUST-101",
      name: "Eleanor Vance",
      email: "eleanor@example.com",
      ordersCount: 4,
      totalSpent: 34500,
      joined: "2026-01-12",
    },
    {
      id: "CUST-102",
      name: "Aria Montgomery",
      email: "aria@example.com",
      ordersCount: 2,
      totalSpent: 18200,
      joined: "2026-03-05",
    },
    {
      id: "CUST-103",
      name: "Sophia Sterling",
      email: "sophia@example.com",
      ordersCount: 7,
      totalSpent: 62400,
      joined: "2025-11-20",
    },
    {
      id: "CUST-104",
      name: "Isabella Rossi",
      email: "isabella@example.com",
      ordersCount: 1,
      totalSpent: 5950,
      joined: "2026-08-27",
    },
  ];

  const filteredCustomers = sampleCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase())
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
            Registered customer accounts, purchasing metrics and profiles
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          type="text"
          placeholder="Search customers by name, email or ID..."
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
                <th className="py-3.5 px-4 font-semibold">Customer ID</th>
                <th className="py-3.5 px-4 font-semibold">Total Orders</th>
                <th className="py-3.5 px-4 font-semibold">Total Spent</th>
                <th className="py-3.5 px-4 font-semibold">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/20 text-brand-espresso">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-brand-bg/40 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-brand-espresso">{cust.name}</p>
                    <p className="text-[10px] text-brand-muted">{cust.email}</p>
                  </td>
                  <td className="py-4 px-4 font-mono text-brand-muted">
                    {cust.id}
                  </td>
                  <td className="py-4 px-4 font-mono font-medium">
                    {cust.ordersCount} orders
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-brand-espresso">
                    ₹{cust.totalSpent.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-brand-muted font-sans">
                    {cust.joined}
                  </td>
                </tr>
              ))}
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

