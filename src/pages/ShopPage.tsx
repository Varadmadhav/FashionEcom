"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useProductStore } from "@/context/ProductStoreContext";
import { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import FilterDrawer from "@/components/FilterDrawer";
import OfferMarquee from "@/components/OfferMarquee";
import { SlidersHorizontal, ChevronDown, Check, X, ArrowUpDown } from "lucide-react";

function ShopContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allProducts } = useProductStore();

  // Search parameter checks
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");
  const searchParam = searchParams.get("search");

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(12000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  
  // Desktop dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Sync state with query parameters
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    } else if (filterParam === "new") {
      setSelectedCategory("new-in");
    } else {
      setSelectedCategory("all");
    }
  }, [categoryParam, filterParam]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setPriceRange(12000);
    setOnlyInStock(false);
    setSortBy("featured");
    navigate("/shop");
  };

  const hasActiveFilters =
    selectedSizes.length > 0 ||
    priceRange < 12000 ||
    onlyInStock ||
    sortBy !== "featured" ||
    searchParam !== null;

  // Filtered Products computation — reads from centralized store
  const filteredProducts = allProducts
    .filter((product) => {
      // Category tab filter
      if (selectedCategory === "new-in") {
        if (!product.badges?.includes("New Arrival") && !product.newArrival) return false;
      } else if (selectedCategory !== "all") {
        if (product.category !== selectedCategory) return false;
      }

      // Sizes filter
      if (selectedSizes.length > 0) {
        const matchesSize = product.sizes.some((s) => selectedSizes.includes(s));
        if (!matchesSize) return false;
      }

      // Price limit filter
      if (product.price > priceRange) return false;

      // Stock status filter
      if (onlyInStock && !product.availability) return false;

      // Global Search filter
      if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sorting implementation
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "oldest") {
        return new Date(a.addedAt || 0).getTime() - new Date(b.addedAt || 0).getTime();
      }
      // Featured / Default: newest items first
      return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime();
    });

  const categories = [
    { label: "ALL", value: "all" },
    { label: "NEW IN", value: "new-in" },
    { label: "DRESSES", value: "dresses" },
    { label: "TOPS", value: "tops" },
    { label: "BOTTOMS", value: "bottoms" },
    { label: "CO-ORDS", value: "coords" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg pt-36 md:pt-44 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Page Header */}
        <div className="py-8 text-center space-y-2 md:space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light tracking-wide uppercase text-brand-espresso">
            SHOP
          </h1>
          <p className="font-sans text-xs md:text-sm text-brand-muted tracking-wider">
            {searchParam ? (
              <span>Search results for "{searchParam}"</span>
            ) : (
              <span>Explore the curated collections.</span>
            )}
          </p>
        </div>

        {/* Category Tabs Section */}
        <div className="border-b border-brand-border/40 pb-3 flex justify-center overflow-x-auto no-scrollbar snap-x snap-mandatory">
          <div className="flex gap-8 px-4">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  if (cat.value === "new-in") {
                    navigate("/shop?filter=new");
                  } else if (cat.value === "all") {
                    navigate("/shop");
                  } else {
                    navigate(`/shop?category=${cat.value}`);
                  }
                }}
                className={`font-sans text-[11px] font-semibold uppercase tracking-widest relative pb-2 whitespace-nowrap snap-center transition-colors duration-300 ${
                  selectedCategory === cat.value
                    ? "text-brand-fg"
                    : "text-brand-muted hover:text-brand-fg"
                }`}
              >
                <span>{cat.label}</span>
                {selectedCategory === cat.value && (
                  <span className="absolute left-0 bottom-0 w-full h-[1.5px] bg-brand-espresso" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sort Row */}
        <div className="py-6 flex items-center justify-between border-b border-brand-border/30">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 border border-brand-border px-4 py-2.5 font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.5]" />
            <span>Filter / Sort</span>
          </button>

          {/* Desktop Filter Row */}
          <div className="hidden md:flex items-center gap-4 relative">
            <span className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-muted flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5 stroke-[1.25]" />
              <span>Filters:</span>
            </span>

            {/* Sizes Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "size" ? null : "size")}
                className="flex items-center gap-1.5 border border-brand-border/60 hover:border-brand-muted px-4 py-2 font-sans text-xxs uppercase tracking-wider text-brand-espresso bg-brand-bg transition-colors duration-300"
              >
                <span>Size</span>
                <ChevronDown className="h-3 w-3 stroke-[1.25]" />
              </button>
              {activeDropdown === "size" && (
                <div className="absolute left-0 mt-2 z-30 bg-brand-bg border border-brand-border p-4 w-48 shadow-lg space-y-2">
                  {sizes.map((sz) => {
                    const active = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className="flex items-center justify-between w-full text-left font-sans text-xxs uppercase tracking-wider py-1.5 text-brand-fg hover:text-brand-espresso"
                      >
                        <span>{sz}</span>
                        {active && <Check className="h-3.5 w-3.5 stroke-[1.5] text-brand-espresso" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
                className="flex items-center gap-1.5 border border-brand-border/60 hover:border-brand-muted px-4 py-2 font-sans text-xxs uppercase tracking-wider text-brand-espresso bg-brand-bg transition-colors duration-300"
              >
                <span>Price</span>
                <ChevronDown className="h-3 w-3 stroke-[1.25]" />
              </button>
              {activeDropdown === "price" && (
                <div className="absolute left-0 mt-2 z-30 bg-brand-bg border border-brand-border p-4 w-60 shadow-lg space-y-3">
                  <input
                    type="range"
                    min="2000"
                    max="12000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-brand-espresso bg-brand-border h-1 appearance-none rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center justify-between font-sans text-xxs uppercase tracking-widest text-brand-muted">
                    <span>Min: ₹2,000</span>
                    <span className="text-brand-espresso font-semibold">Max: ₹{priceRange.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Availability Checkbox */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`flex items-center gap-1.5 border px-4 py-2 font-sans text-xxs uppercase tracking-wider bg-brand-bg transition-colors duration-300 ${
                onlyInStock
                  ? "border-brand-espresso text-brand-espresso"
                  : "border-brand-border/60 text-brand-muted hover:border-brand-muted"
              }`}
            >
              <span>In Stock Only</span>
              {onlyInStock && <Check className="h-3 w-3 stroke-[1.5]" />}
            </button>

            {/* Clear All Trigger */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-espresso font-semibold underline decoration-brand-border underline-offset-2 transition-all"
              >
                <span>Clear All</span>
                <X className="h-3 w-3 stroke-[1.5]" />
              </button>
            )}
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "sort" ? null : "sort")}
              className="flex items-center gap-1.5 border border-brand-border/60 hover:border-brand-muted px-4 py-2 font-sans text-xxs uppercase tracking-wider text-brand-espresso bg-brand-bg transition-colors duration-300"
            >
              <ArrowUpDown className="h-3 w-3 stroke-[1.25] text-brand-muted" />
              <span>Sort By</span>
              <ChevronDown className="h-3 w-3 stroke-[1.25]" />
            </button>
            {activeDropdown === "sort" && (
              <div className="absolute right-0 mt-2 z-30 bg-brand-bg border border-brand-border p-4 w-48 shadow-lg space-y-2">
                {[
                  { label: "Featured", value: "featured" },
                  { label: "Price: Low to High", value: "price-asc" },
                  { label: "Price: High to Low", value: "price-desc" },
                  { label: "New Arrivals", value: "newest" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setActiveDropdown(null);
                    }}
                    className={`flex items-center justify-between w-full text-left font-sans text-xxs uppercase tracking-wider py-1.5 ${
                      sortBy === opt.value
                        ? "text-brand-espresso font-bold"
                        : "text-brand-fg hover:text-brand-espresso"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <Check className="h-3.5 w-3.5 stroke-[1.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Pill list */}
        {hasActiveFilters && (
          <div className="py-4 flex flex-wrap gap-2 items-center">
            <span className="font-sans text-[10px] uppercase tracking-wider text-brand-muted">
              Active:
            </span>
            {searchParam && (
              <span className="inline-flex items-center gap-1 bg-brand-surface/40 border border-brand-border/40 px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider text-brand-espresso">
                <span>Query: "{searchParam}"</span>
                <X
                  className="h-3 w-3 stroke-[1.5] cursor-pointer hover:text-brand-fg"
                  onClick={() => {
                    navigate("/shop");
                  }}
                />
              </span>
            )}
            {selectedSizes.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1 bg-brand-surface/40 border border-brand-border/40 px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider text-brand-espresso"
              >
                <span>Size: {sz}</span>
                <X
                  className="h-3 w-3 stroke-[1.5] cursor-pointer hover:text-brand-fg"
                  onClick={() => toggleSize(sz)}
                />
              </span>
            ))}
            {priceRange < 12000 && (
              <span className="inline-flex items-center gap-1 bg-brand-surface/40 border border-brand-border/40 px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider text-brand-espresso"
              >
                <span>Under ₹{priceRange.toLocaleString("en-IN")}</span>
                <X
                  className="h-3 w-3 stroke-[1.5] cursor-pointer hover:text-brand-fg"
                  onClick={() => setPriceRange(12000)}
                />
              </span>
            )}
            {onlyInStock && (
              <span className="inline-flex items-center gap-1 bg-brand-surface/40 border border-brand-border/40 px-2.5 py-1 text-[10px] font-sans uppercase tracking-wider text-brand-espresso"
              >
                <span>In Stock Only</span>
                <X
                  className="h-3 w-3 stroke-[1.5] cursor-pointer hover:text-brand-fg"
                  onClick={() => setOnlyInStock(false)}
                />
              </span>
            )}
          </div>
        )}

        {/* Product Grid Area */}
        <div className="py-8">
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <SlidersHorizontal className="h-10 w-10 stroke-[0.75] text-brand-muted mb-4" />
              <h2 className="font-serif text-xl italic text-brand-espresso">
                No items match your selection.
              </h2>
              <p className="font-sans text-xs text-brand-muted tracking-wider mt-2 max-w-xs leading-relaxed">
                Try loosening your parameters or resetting filters to view all products.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-6 border border-brand-espresso bg-brand-espresso text-brand-bg px-6 py-3 font-sans text-xxs font-bold uppercase tracking-widest hover:bg-brand-black transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 animate-fade-in">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} variant="default" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only Bottom-Sheet Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSizes={selectedSizes}
        toggleSize={toggleSize}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        onlyInStock={onlyInStock}
        setOnlyInStock={setOnlyInStock}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
}

// Fallback skeleton loader
function ShopSkeleton() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg pt-32 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-brand-surface w-32 mx-auto rounded"></div>
          <div className="h-4 bg-brand-surface w-48 mx-auto rounded"></div>
          <div className="h-[2px] bg-brand-surface w-full mt-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-brand-surface w-full rounded"></div>
                <div className="h-3 bg-brand-surface w-2/3 rounded"></div>
                <div className="h-3 bg-brand-surface w-1/3 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
