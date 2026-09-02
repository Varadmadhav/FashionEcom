import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "@/context/ProductStoreContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import ProductCard from "@/components/ProductCard";
import {
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Tag,
  Sparkles,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import CloudinaryImage from "@/components/CloudinaryImage";
import DirectPricingBreakdown from "@/components/pdp/DirectPricingBreakdown";
import FactoryFootage from "@/components/pdp/FactoryFootage";
import SocialImpactBanner from "@/components/pdp/SocialImpactBanner";
import ProductReviews from "@/components/pdp/ProductReviews";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, getRelatedProducts } = useProductStore();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, openAuthModal } = useCustomerAuth();

  const product = slug ? getProductBySlug(slug) : undefined;
  const relatedProducts = product ? getRelatedProducts(product, 4) : [];

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      setSelectedSize("");
      setOpenAccordion("details");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center pt-36">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-brand-fg mb-4">Product Not Found</h2>
          <Link
            to="/shop"
            className="text-brand-muted hover:text-brand-fg uppercase tracking-widest text-sm font-semibold underline underline-offset-4 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [...product.images, ...product.galleryImages];
  const inWishlist = isInWishlist(product.id);
  const currentImgIndex = allImages.indexOf(selectedImage);

  const handlePrevImage = () => {
    const prevIdx = (currentImgIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIdx]);
  };

  const handleNextImage = () => {
    const nextIdx = (currentImgIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIdx]);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to bag");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: "Natural",
      image: product.images[0],
    });
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    toggleWishlist(product.id);
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="bg-brand-bg min-h-screen pt-36 md:pt-44 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6 text-xs uppercase tracking-widest text-brand-muted flex items-center space-x-2">
          <Link to="/shop" className="hover:text-brand-fg transition">Shop</Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-brand-espresso font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
          
          {/* Left Column: Smart Uncropped Main Image Viewer + Gallery Thumbnails Below */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Main Image Container */}
            <div className="relative w-full h-[460px] sm:h-[520px] md:h-[540px] bg-[#FAF7F2] rounded-2xl border border-brand-border/40 overflow-hidden flex items-center justify-center p-3 shadow-xs group">
              <CloudinaryImage
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                width={1200}
                className="w-full h-full object-contain transition-all duration-300 drop-shadow-xs"
              />

              {/* Left & Right Carousel Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-brand-espresso flex items-center justify-center shadow-md backdrop-blur-xs transition transform hover:scale-105 border border-brand-border/30"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-brand-espresso flex items-center justify-center shadow-md backdrop-blur-xs transition transform hover:scale-105 border border-brand-border/30"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Counter Indicator */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-brand-espresso/80 text-white text-[10px] font-mono px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {currentImgIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Horizontal Thumbnail Strip Centered Directly Below Main Image */}
            {allImages.length > 1 && (
              <div className="flex justify-center items-center gap-3 overflow-x-auto pb-2 w-full scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    onMouseEnter={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-[#FAF7F2] ${
                      selectedImage === img
                        ? "border-brand-espresso shadow-xs scale-102"
                        : "border-brand-border/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <CloudinaryImage
                      src={img}
                      width={200}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Actions */}
          <div className="lg:col-span-5 flex flex-col space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/40 shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted uppercase tracking-widest text-[11px] font-semibold">
                  {product.collection || "Heritage Collection"}
                </span>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  In Stock • Direct Dispatch
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-brand-espresso mt-1 font-normal">
                {product.name}
              </h1>
              <div className="text-brand-muted text-xs font-mono mt-1">
                SKU: {product.sku}
              </div>
            </div>

            {/* Price & Offer Highlight */}
            <div className="flex items-center space-x-3 border-y border-brand-border/30 py-4">
              <span className="text-2xl font-bold font-sans text-brand-espresso">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice && (
                <span className="text-base text-brand-muted line-through font-mono">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Tag size={12} />
                  <span>SAVE ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}</span>
                </span>
              )}
            </div>

            {/* High Converting 6 Kurtis in ₹499 Bragging Banner */}
            <div className="bg-gradient-to-r from-amber-100/90 via-orange-50 to-amber-100/80 border-2 border-amber-400/80 rounded-2xl p-4 shadow-sm animate-pulse-subtle">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-xs text-brand-espresso">
                  <span className="bg-brand-espresso text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Flame size={11} className="fill-amber-300 text-amber-300" />
                    <span>MEGA DEAL</span>
                  </span>
                  <span className="text-sm font-serif">6 Kurtis in ₹499</span>
                </div>
                <span className="font-mono text-xs font-bold text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-lg border border-amber-300">
                  ₹83 / Kurti
                </span>
              </div>
              <p className="text-xs text-brand-fg font-medium mt-1.5 leading-snug">
                Mix & match any 6 kurtis from our store. Direct factory bundle discount applies automatically at checkout!
              </p>
            </div>

            <p className="text-brand-fg text-xs leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-espresso font-semibold uppercase tracking-wider">
                  Select Size
                </span>
                <span className="text-amber-800 text-[11px] font-bold">🔥 6 for ₹499 Mega Combo Active</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      selectedSize === size
                        ? "border-brand-espresso bg-brand-espresso text-brand-bg shadow-sm"
                        : "border-brand-border bg-brand-bg text-brand-fg hover:border-brand-espresso"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.availability || product.stockQuantity === 0}
                className="w-full bg-brand-espresso text-brand-bg uppercase tracking-widest text-xs font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {!product.availability || product.stockQuantity === 0
                    ? "Out of Stock"
                    : "Add to Bag (6 for ₹499 Offer)"}
                </span>
              </button>

              <button
                onClick={handleWishlistClick}
                className={`w-full border border-brand-border uppercase tracking-widest text-xs font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  inWishlist
                    ? "bg-amber-50 text-amber-900 border-amber-300"
                    : "text-brand-espresso hover:bg-brand-bg"
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-amber-800 text-amber-800" : ""}`} />
                <span>{inWishlist ? "Added to Wishlist" : "Add to Wishlist"}</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-brand-border/30 text-center text-[10px] text-brand-muted">
              <div className="flex flex-col items-center">
                <Truck size={16} className="text-amber-800 mb-1" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw size={16} className="text-amber-800 mb-1" />
                <span>7-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck size={16} className="text-emerald-700 mb-1" />
                <span>COD Available</span>
              </div>
            </div>

            {/* Accordion Details */}
            <div className="border-t border-brand-border/40 pt-4 space-y-3">
              <div className="border-b border-brand-border/30 pb-3">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex justify-between items-center text-xs uppercase tracking-wider font-semibold text-brand-espresso"
                >
                  <span>Details & Specifications</span>
                  {openAccordion === "details" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === "details" && (
                  <ul className="mt-2 space-y-1 text-xs text-brand-muted list-disc list-inside">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 1. Customer Reviews & Ratings (Meesho / Myntra Style) */}
        <ProductReviews product={product} />

        {/* 2. How We Deliver at Such Low Pricing */}
        <DirectPricingBreakdown />

        {/* 3. Real Footage from Our Factory */}
        <FactoryFootage />

        {/* 4. 10% of Your Order to Women's Education */}
        <SocialImpactBanner />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-brand-border/40 pt-16">
            <h2 className="font-serif text-2xl font-normal text-brand-espresso mb-8 text-center uppercase tracking-wider">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
