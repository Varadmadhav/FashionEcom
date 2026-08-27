"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "editorial";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const favorited = isInWishlist(product.id);

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: size,
      color: product.colors[0]?.name || "Natural",
      image: product.images[0],
    });
    setShowSizes(false);
  };

  // Image assets
  const mainImage = product.images[0];
  const hoverImage = product.images[1] || mainImage;

  if (variant === "compact") {
    return (
      <div
        className="group relative flex flex-col w-full text-brand-fg bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowSizes(false);
        }}
      >
        {/* Compact Image container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-surface border border-brand-border/20">
          <img
            src={mainImage}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? "opacity-0 scale-102" : "opacity-100 scale-100"
            }`}
            loading="lazy"
          />
          <img
            src={hoverImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-98"
            }`}
            loading="lazy"
          />

          {/* Sold out overlay */}
          {!product.availability && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-black/35 backdrop-blur-[1px]">
              <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-brand-bg border border-brand-bg/40 px-3 py-1">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-brand-bg/75 rounded-full border border-brand-border/40 text-brand-fg hover:bg-brand-bg transition-colors duration-300 shadow-sm"
          >
            <Heart
              className={`h-4 w-4 stroke-[1.25] transition-colors duration-300 ${
                favorited ? "fill-brand-espresso text-brand-espresso" : "text-brand-fg"
              }`}
            />
          </button>
        </div>

        {/* Compact Metadata */}
        <div className="mt-3 flex justify-between gap-1 text-[11px] font-sans">
          <span className="uppercase tracking-tight text-brand-espresso truncate font-medium max-w-[70%]">
            {product.name}
          </span>
          <span className="font-semibold text-brand-espresso">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    );
  }

  if (variant === "editorial") {
    return (
      <div
        className="group relative flex flex-col w-full text-brand-fg bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowSizes(false);
        }}
      >
        {/* Editorial Image container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-surface border border-brand-border/20">
          <img
            src={mainImage}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? "opacity-0 scale-103" : "opacity-100 scale-100"
            }`}
            loading="lazy"
          />
          <img
            src={hoverImage}
            alt={`${product.name} alternate`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-97"
            }`}
            loading="lazy"
          />

          {/* Sizing Drawer Overlay on hover */}
          {product.availability && isHovered && (
            <div className="absolute inset-x-0 bottom-0 z-10 bg-brand-bg/95 backdrop-blur-[2px] p-4 border-t border-brand-border flex flex-col items-center gap-2 animate-fade-in-up">
              <span className="font-sans text-[10px] uppercase tracking-widest text-brand-muted font-semibold">
                Quick Select Size
              </span>
              <div className="flex gap-1.5 justify-center w-full">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickAdd(sz, e)}
                    className="h-8 w-9 border border-brand-border bg-brand-bg text-[10px] font-sans hover:bg-brand-espresso hover:text-brand-bg transition-all duration-200"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sold out overlay */}
          {!product.availability && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-black/35 backdrop-blur-[1px]">
              <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-brand-bg border border-brand-bg/40 px-3 py-1">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-brand-bg/75 rounded-full border border-brand-border/40 text-brand-fg hover:bg-brand-bg transition-colors duration-300 shadow-sm"
          >
            <Heart
              className={`h-4 w-4 stroke-[1.25] transition-colors duration-300 ${
                favorited ? "fill-brand-espresso text-brand-espresso" : "text-brand-fg"
              }`}
            />
          </button>
        </div>

        {/* Editorial Text */}
        <div className="mt-4 text-center">
          <p className="font-serif text-sm italic text-brand-muted">{product.category}</p>
          <h3 className="font-sans text-xs uppercase tracking-widest text-brand-espresso mt-1 font-semibold">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-brand-espresso mt-1.5 font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    );
  }

  // Default Variant
  return (
    <div
      className="group relative flex flex-col w-full text-brand-fg bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSizes(false);
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand-surface border border-brand-border/20">
        <img
          src={mainImage}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered ? "opacity-0 scale-102" : "opacity-100 scale-100"
          }`}
          loading="lazy"
        />
        <img
          src={hoverImage}
          alt={`${product.name} alternate`}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-98"
          }`}
          loading="lazy"
        />

        {/* Sold out overlay */}
        {!product.availability && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-black/35 backdrop-blur-[1px]">
            <span className="font-sans text-[10px] font-medium uppercase tracking-widest text-brand-bg border border-brand-bg/40 px-3 py-1">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-brand-bg/75 rounded-full border border-brand-border/40 text-brand-fg hover:bg-brand-bg transition-colors duration-300 shadow-sm"
        >
          <Heart
            className={`h-4.5 w-4.5 stroke-[1.25] transition-colors duration-300 ${
              favorited ? "fill-brand-espresso text-brand-espresso" : "text-brand-fg"
            }`}
          />
        </button>

        {/* Quick Add Sizing Grid on Hover */}
        {product.availability && (
          <div
            className={`absolute inset-x-0 bottom-0 z-10 bg-brand-bg/95 backdrop-blur-[2px] p-4 border-t border-brand-border transition-all duration-300 flex flex-col items-center gap-2 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            {showSizes ? (
              <>
                <span className="font-sans text-[9px] uppercase tracking-widest text-brand-muted font-bold">
                  Select Size
                </span>
                <div className="flex gap-1 justify-center w-full">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => handleQuickAdd(sz, e)}
                      className="h-7 w-8 border border-brand-border bg-brand-bg text-[9px] font-sans hover:bg-brand-espresso hover:text-brand-bg transition-all duration-150"
                    >
                      {sz}
                    </button>
                  ))}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowSizes(false);
                    }}
                    className="h-7 px-2 border border-brand-border bg-brand-bg text-[9px] font-sans hover:bg-brand-surface transition-colors duration-150 text-brand-muted"
                  >
                    Back
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSizes(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-brand-espresso text-brand-bg py-2.5 text-[10px] font-medium uppercase tracking-widest hover:bg-brand-black transition-colors duration-300 font-sans"
              >
                <Plus className="h-3 w-3 stroke-[1.5]" />
                <span>Quick Add</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Details Panel */}
      <div className="mt-4 flex flex-col gap-1.5 px-1">
        {/* Title and Colors */}
        <div className="flex justify-between items-start">
          <h3 className="font-sans text-xs uppercase tracking-wider text-brand-espresso font-semibold group-hover:text-brand-fg transition-colors duration-300">
            {product.name}
          </h3>
          {/* Swatches indicator */}
          <div className="flex gap-1 items-center">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-2 w-2 rounded-full border border-brand-border/60"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Category & Price */}
        <div className="flex justify-between items-center">
          <span className="font-serif italic text-xs text-brand-muted capitalize">
            {product.category}
          </span>
          <span className="font-sans text-xs text-brand-espresso font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

