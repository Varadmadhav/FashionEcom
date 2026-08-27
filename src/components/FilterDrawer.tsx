"use client";

import React, { useState, useEffect } from "react";
import { useLenis } from "lenis/react";
import { X, ChevronDown, Check } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  selectedColors: string[];
  toggleColor: (color: string) => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
  onlyInStock: boolean;
  setOnlyInStock: (stock: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  clearAllFilters: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedSizes,
  toggleSize,
  selectedColors,
  toggleColor,
  priceRange,
  setPriceRange,
  onlyInStock,
  setOnlyInStock,
  sortBy,
  setSortBy,
  clearAllFilters,
}: FilterDrawerProps) {
  const lenis = useLenis();
  const [openSection, setOpenSection] = useState<string | null>("category");

  // Pause scroll when drawer is open
  useEffect(() => {
    if (!lenis) return;
    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => {
      lenis.start();
    };
  }, [isOpen, lenis]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const categories = [
    { label: "All Products", value: "all" },
    { label: "Dresses", value: "dresses" },
    { label: "Tops", value: "tops" },
    { label: "Bottoms", value: "bottoms" },
    { label: "Co-ords", value: "coords" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL"];

  const colors = [
    { name: "Bone Ivory", hex: "#F4F1EA" },
    { name: "Sage", hex: "#B8C1B4" },
    { name: "Espresso", hex: "#2A2521" },
    { name: "Dusty Rose", hex: "#C39B8B" },
    { name: "Oatmeal", hex: "#E5DEC9" },
    { name: "Vanilla", hex: "#F5EFEB" },
  ];

  const sortingOptions = [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "New Arrivals", value: "newest" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/30 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-[20px] bg-brand-bg text-brand-fg shadow-2xl transition-transform duration-500 border-t border-brand-border">
        {/* Notch Indicator */}
        <div className="flex justify-center py-3">
          <div className="h-1 w-12 rounded-full bg-brand-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-6 pb-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-espresso">
            Filters & Sorting
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-brand-muted hover:text-brand-fg transition-colors duration-200"
          >
            <X className="h-5 w-5 stroke-[1.25]" />
          </button>
        </div>

        {/* Accordions */}
        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar space-y-2">
          {/* SORT BY ACCORDION */}
          <div className="border-b border-brand-border/40 py-2">
            <button
              onClick={() => toggleSection("sort")}
              className="flex w-full items-center justify-between py-2 text-left font-sans text-xs uppercase tracking-wider text-brand-fg font-medium"
            >
              <span>Sort By</span>
              <ChevronDown
                className={`h-4 w-4 stroke-[1.25] text-brand-muted transition-transform duration-300 ${
                  openSection === "sort" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "sort" && (
              <div className="grid grid-cols-2 gap-2 py-3 animate-fade-in">
                {sortingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`border px-3 py-2.5 text-center font-sans text-xxs uppercase tracking-wider transition-all duration-300 ${
                      sortBy === opt.value
                        ? "border-brand-espresso bg-brand-espresso text-brand-bg"
                        : "border-brand-border bg-brand-bg text-brand-fg"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CATEGORY ACCORDION */}
          <div className="border-b border-brand-border/40 py-2">
            <button
              onClick={() => toggleSection("category")}
              className="flex w-full items-center justify-between py-2 text-left font-sans text-xs uppercase tracking-wider text-brand-fg font-medium"
            >
              <span>Category</span>
              <ChevronDown
                className={`h-4 w-4 stroke-[1.25] text-brand-muted transition-transform duration-300 ${
                  openSection === "category" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "category" && (
              <div className="flex flex-col gap-1 py-3 animate-fade-in">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center justify-between px-3 py-2 text-left font-sans text-xs transition-colors duration-200 ${
                      selectedCategory === cat.value
                        ? "bg-brand-surface/40 text-brand-espresso font-medium"
                        : "text-brand-fg hover:bg-brand-surface/20"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.value && <Check className="h-4 w-4 stroke-[1.5]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SIZE ACCORDION */}
          <div className="border-b border-brand-border/40 py-2">
            <button
              onClick={() => toggleSection("size")}
              className="flex w-full items-center justify-between py-2 text-left font-sans text-xs uppercase tracking-wider text-brand-fg font-medium"
            >
              <span>Sizes</span>
              <ChevronDown
                className={`h-4 w-4 stroke-[1.25] text-brand-muted transition-transform duration-300 ${
                  openSection === "size" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "size" && (
              <div className="flex flex-wrap gap-2 py-3 animate-fade-in">
                {sizes.map((sz) => {
                  const active = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`flex h-10 w-12 items-center justify-center border font-sans text-xs transition-all duration-300 ${
                        active
                          ? "border-brand-espresso bg-brand-espresso text-brand-bg font-semibold"
                          : "border-brand-border bg-brand-bg text-brand-fg"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* COLOR ACCORDION */}
          <div className="border-b border-brand-border/40 py-2">
            <button
              onClick={() => toggleSection("color")}
              className="flex w-full items-center justify-between py-2 text-left font-sans text-xs uppercase tracking-wider text-brand-fg font-medium"
            >
              <span>Colors</span>
              <ChevronDown
                className={`h-4 w-4 stroke-[1.25] text-brand-muted transition-transform duration-300 ${
                  openSection === "color" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "color" && (
              <div className="grid grid-cols-3 gap-2 py-3 animate-fade-in">
                {colors.map((col) => {
                  const active = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      onClick={() => toggleColor(col.name)}
                      className={`flex items-center gap-2 border px-2.5 py-2 text-left transition-all duration-300 ${
                        active
                          ? "border-brand-espresso bg-brand-surface/40"
                          : "border-brand-border bg-brand-bg"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-brand-border flex-shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="font-sans text-xxs uppercase tracking-wider truncate text-brand-espresso">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* PRICE RANGE ACCORDION */}
          <div className="border-b border-brand-border/40 py-2">
            <button
              onClick={() => toggleSection("price")}
              className="flex w-full items-center justify-between py-2 text-left font-sans text-xs uppercase tracking-wider text-brand-fg font-medium"
            >
              <span>Price Range</span>
              <ChevronDown
                className={`h-4 w-4 stroke-[1.25] text-brand-muted transition-transform duration-300 ${
                  openSection === "price" ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === "price" && (
              <div className="py-4 px-2 animate-fade-in space-y-3">
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

          {/* AVAILABILITY ACCORDION */}
          <div className="py-2">
            <div className="flex items-center justify-between py-2">
              <span className="font-sans text-xs uppercase tracking-wider text-brand-fg font-medium">
                In Stock Only
              </span>
              <button
                onClick={() => setOnlyInStock(!onlyInStock)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  onlyInStock ? "bg-brand-espresso" : "bg-brand-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-brand-bg shadow ring-0 transition duration-200 ease-in-out ${
                    onlyInStock ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-brand-border bg-brand-surface/40 px-6 py-4 flex gap-4">
          <button
            onClick={() => {
              clearAllFilters();
              onClose();
            }}
            className="flex-1 border border-brand-border bg-brand-bg py-3.5 text-center font-sans text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-fg hover:border-brand-muted transition-all duration-300"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-brand-espresso py-3.5 text-center font-sans text-xxs uppercase tracking-widest text-brand-bg font-semibold hover:bg-brand-black transition-colors duration-300"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

