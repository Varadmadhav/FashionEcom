"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearch } from "@/context/SearchContext";
import { useProductStore } from "@/context/ProductStoreContext";
import { Product } from "@/data/products";
import { useLenis } from "lenis/react";
import { X, Search, ArrowRight, CornerDownLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CloudinaryImage from "./CloudinaryImage";

export default function SearchDrawer() {
  const {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useSearch();

  const { allProducts } = useProductStore();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const lenis = useLenis();

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isSearchOpen]);

  // Pause scroll when open
  useEffect(() => {
    if (!lenis) return;
    if (isSearchOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => {
      lenis.start();
    };
  }, [isSearchOpen, lenis]);

  // Filter products in real time
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
    setFilteredProducts(results.slice(0, 5)); // show top 5
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      setIsSearchOpen(false);
      // Navigate to shop with search query
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleRecentClick = (term: string) => {
    setSearchQuery(term);
    setIsSearchOpen(false);
    window.location.href = `/shop?search=${encodeURIComponent(term)}`;
  };

  const handleCategoryClick = (category: string) => {
    setIsSearchOpen(false);
    window.location.href = `/shop?category=${category}`;
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/35 backdrop-blur-[2px] transition-opacity duration-500"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full flex-col bg-brand-bg text-brand-fg shadow-2xl transition-transform duration-500 md:max-w-xl border-l border-brand-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">
          <span className="font-sans text-xs font-medium uppercase tracking-widest text-brand-muted">
            Search Collection
          </span>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="flex items-center gap-1 font-sans text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-fg transition-colors duration-300"
          >
            <span>Close</span>
            <X className="h-4 w-4 stroke-[1.25]" />
          </button>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearchSubmit} className="border-b border-brand-border bg-brand-surface/20 px-6 py-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 stroke-[1.25] text-brand-muted" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by product, category, fabric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-bg border border-brand-border py-4 pl-12 pr-12 font-sans text-sm tracking-wide text-brand-fg placeholder:text-brand-muted focus:border-brand-muted focus:outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 p-1 text-brand-muted hover:text-brand-fg"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            )}
          </div>
          <div className="mt-2 flex items-center justify-end gap-1 text-xxs text-brand-muted tracking-wider">
            <span>Press Enter to search</span>
            <CornerDownLeft className="h-3 w-3 stroke-[1]" />
          </div>
        </form>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar space-y-8">
          {/* Results List */}
          {searchQuery.trim() !== "" ? (
            <div>
              <h3 className="font-sans text-xxs uppercase tracking-widest text-brand-muted mb-4">
                Products Found ({filteredProducts.length})
              </h3>
              {filteredProducts.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-serif italic text-sm text-brand-muted">No items match your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <a
                      key={product.id}
                      href={`/shop?product=${product.slug}`}
                      className="flex gap-4 items-center p-2 hover:bg-brand-surface/40 border border-transparent hover:border-brand-border/40 transition-all duration-300 group"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <div className="relative aspect-[3/4] w-12 bg-brand-surface overflow-hidden">
                        <CloudinaryImage
                          src={product.images[0]}
                          alt={product.name}
                          width={200}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-sans text-xs uppercase tracking-tight text-brand-espresso font-medium group-hover:text-brand-fg transition-colors duration-300">
                          {product.name}
                        </h4>
                        <p className="font-sans text-xxs text-brand-muted uppercase tracking-wider mt-0.5">
                          {product.category}
                        </p>
                      </div>
                      <span className="font-sans text-xs text-brand-espresso">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </a>
                  ))}
                  {filteredProducts.length > 0 && (
                    <button
                      type="submit"
                      onClick={handleSearchSubmit}
                      className="w-full flex items-center justify-between border border-brand-border bg-brand-surface/30 px-4 py-3 hover:bg-brand-surface text-xxs uppercase tracking-widest text-brand-fg transition-colors duration-300"
                    >
                      <span>View all matching items</span>
                      <ArrowRight className="h-4 w-4 stroke-[1.25]" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans text-xxs uppercase tracking-widest text-brand-muted">
                      Recent Searches
                    </h3>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="font-sans text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-fg underline decoration-brand-border underline-offset-2 transition-colors duration-300"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => handleRecentClick(term)}
                        className="border border-brand-border bg-brand-bg px-3 py-1.5 font-sans text-xs text-brand-fg hover:bg-brand-surface transition-all duration-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div>
                <h3 className="font-sans text-xxs uppercase tracking-widest text-brand-muted mb-4">
                  Popular Categories
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Dresses", value: "dresses" },
                    { label: "Tops", value: "tops" },
                    { label: "Bottoms", value: "bottoms" },
                    { label: "Co-ords", value: "coords" },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategoryClick(cat.value)}
                      className="flex items-center justify-between border border-brand-border/60 bg-brand-surface/20 px-4 py-3 hover:bg-brand-surface hover:border-brand-border transition-all duration-300 font-sans text-xs uppercase tracking-wider text-brand-fg"
                    >
                      <span>{cat.label}</span>
                      <ArrowRight className="h-3 w-3 stroke-[1.25]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Aesthetic Brand Text */}
              <div className="border-t border-brand-border/40 pt-6">
                <p className="font-serif italic text-xs text-brand-muted leading-relaxed">
                  "Thoughtfully designed silhouettes, fine fabrics, and a modern viewpoint. Explore considered wardrobe essentials built to endure."
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

