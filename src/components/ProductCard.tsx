"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "editorial";
}

export default function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [justAddedSize, setJustAddedSize] = useState<string | null>(null);

  const favorited = isInWishlist(product.id);

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: size,
      color: "Natural",
      image: product.images[0],
    });
    setJustAddedSize(size);
    setTimeout(() => {
      setJustAddedSize(null);
    }, 1500);
  };

  // Image assets
  const mainImage = product.images[0];
  const hoverImage = product.images[1] || mainImage;

  // Badge display helpers
  const hasNewArrivalBadge = product.badges?.includes("New Arrival");
  const hasOnSaleBadge = product.badges?.includes("On Sale");

  if (variant === "compact") {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group relative flex flex-col w-full text-brand-fg bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
      </Link>
    );
  }

  if (variant === "editorial") {
    return (
      <Link
        to={`/product/${product.slug}`}
        className="group relative flex flex-col w-full text-brand-fg bg-transparent"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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

          {/* Direct Size Selection Drawer on Hover */}
          {product.availability && isHovered && (
            <div className="absolute inset-x-0 bottom-0 z-10 bg-brand-bg/95 backdrop-blur-[2px] p-3 border-t border-brand-border flex flex-col items-center gap-1.5 animate-fade-in-up">
              <span className="font-sans text-[9px] uppercase tracking-widest text-brand-muted font-bold">
                {justAddedSize ? `Added Size ${justAddedSize} to Bag!` : "Select Size"}
              </span>
              <div className="flex gap-1.5 justify-center flex-wrap w-full">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={(e) => handleQuickAdd(sz, e)}
                    className={`h-7 min-w-8 px-2 border text-[10px] font-sans transition-all duration-200 ${
                      justAddedSize === sz
                        ? "bg-emerald-800 text-white border-emerald-800"
                        : selectedSize === sz
                        ? "bg-brand-espresso text-brand-bg border-brand-espresso font-semibold"
                        : "border-brand-border bg-brand-bg hover:bg-brand-espresso hover:text-brand-bg"
                    }`}
                  >
                    {justAddedSize === sz ? <Check className="w-3 h-3 inline" /> : sz}
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
      </Link>
    );
  }

  // Default Variant
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex flex-col w-full text-brand-fg bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

        {/* Badge overlays (top-left) */}
        {(hasNewArrivalBadge || hasOnSaleBadge) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {hasNewArrivalBadge && (
              <span className="bg-brand-espresso text-brand-bg font-sans text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                New
              </span>
            )}
            {hasOnSaleBadge && (
              <span className="bg-[#8B4513] text-brand-bg font-sans text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
                Sale
              </span>
            )}
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
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-brand-bg/75 rounded-full border border-brand-border/40 text-brand-fg hover:bg-brand-bg transition-colors duration-300 shadow-sm"
        >
          <Heart
            className={`h-4.5 w-4.5 stroke-[1.25] transition-colors duration-300 ${
              favorited ? "fill-brand-espresso text-brand-espresso" : "text-brand-fg"
            }`}
          />
        </button>

        {/* 1-CLICK SELECT SIZE OVERLAY ON HOVER */}
        {product.availability && (
          <div
            className={`absolute inset-x-0 bottom-0 z-10 bg-brand-bg/95 backdrop-blur-[3px] p-3 border-t border-brand-border transition-all duration-300 flex flex-col items-center gap-1.5 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <span className="font-sans text-[9px] uppercase tracking-widest text-brand-espresso font-bold">
              {justAddedSize ? `✓ Added Size ${justAddedSize} to Bag!` : "Quick Select Size"}
            </span>
            <div className="flex gap-1.5 justify-center flex-wrap w-full">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAdd(sz, e)}
                  className={`h-7 px-2.5 border text-[10px] font-sans font-medium transition-all duration-150 rounded-xs cursor-pointer ${
                    justAddedSize === sz
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : selectedSize === sz
                      ? "bg-brand-espresso text-brand-bg border-brand-espresso font-semibold"
                      : "border-brand-border bg-brand-bg text-brand-fg hover:bg-brand-espresso hover:text-brand-bg"
                  }`}
                  title={`Add size ${sz} to bag`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Details Panel */}
      <div className="mt-3.5 flex flex-col gap-1 px-1">
        {/* Title */}
        <div className="flex justify-between items-start">
          <h3 className="font-sans text-xs uppercase tracking-wider text-brand-espresso font-semibold group-hover:text-brand-fg transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Category & Price */}
        <div className="flex justify-between items-center">
          <span className="font-serif italic text-xs text-brand-muted capitalize">
            {product.category}
          </span>
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="font-sans text-[10px] text-brand-muted line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="font-sans text-xs text-brand-espresso font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Available Sizes Bar below product details */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="flex items-center gap-1 mt-1 pt-1 border-t border-brand-border/20">
            <span className="font-sans text-[9px] uppercase tracking-wider text-brand-muted">
              Sizes:
            </span>
            <div className="flex gap-1 flex-wrap">
              {product.sizes.map((s) => (
                <span
                  key={s}
                  className="font-sans text-[9px] font-semibold text-brand-espresso bg-brand-surface/50 px-1.5 py-0.5 rounded-xs"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
