"use client";

import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLenis } from "lenis/react";
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import CloudinaryImage from "./CloudinaryImage";
import { useNavigate } from "react-router-dom";

const formatPrice = (val?: number) => Number(val || 0).toLocaleString("en-IN");

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartCount,
    originalTotal,
    bundleDiscount,
    cartTotal,
    isOfferUnlocked,
  } = useCart();
  const lenis = useLenis();
  const navigate = useNavigate();

  // Pause scrolling when drawer is open
  useEffect(() => {
    if (!lenis) return;
    if (isCartOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => {
      lenis.start();
    };
  }, [isCartOpen, lenis]);

  if (!isCartOpen) return null;

  // XYXX 3-for-999 Offer Progress Bar Calculation
  const itemsInSet = cartCount % 3;
  const progressPercent = isOfferUnlocked && itemsInSet === 0 ? 100 : (itemsInSet / 3) * 100;
  const itemsNeeded = itemsInSet === 0 ? (cartCount === 0 ? 3 : 0) : 3 - itemsInSet;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/35 backdrop-blur-[2px] transition-opacity duration-500"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full flex-col bg-brand-bg text-brand-fg shadow-2xl transition-transform duration-500 sm:max-w-md border-l border-brand-border">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 stroke-[1.25]" />
            <h2 className="font-sans text-xs font-medium uppercase tracking-widest">
              Shopping Bag ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex items-center gap-1 font-sans text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-fg transition-colors duration-300"
          >
            <span>Close</span>
            <X className="h-4 w-4 stroke-[1.25]" />
          </button>
        </div>

        {/* XYXX.com Style Offer Progress Banner */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 border-b border-amber-200/60">
          <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-brand-espresso">
            <div className="flex items-center space-x-1.5">
              <Tag size={13} className="text-amber-700" />
              <span>
                {isOfferUnlocked && itemsNeeded === 0
                  ? "3 FOR ₹999 BUNDLE OFFER UNLOCKED!"
                  : `Add ${itemsNeeded} more item${itemsNeeded > 1 ? "s" : ""} for 3 for ₹999 offer!`}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-mono font-bold">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-amber-200/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-espresso h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-lg italic text-brand-muted">Your bag is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 font-sans text-xs uppercase tracking-widest text-brand-espresso underline underline-offset-4 font-semibold"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={item?.id ? `${item.id}-${item.size || "M"}-${index}` : `cart-item-${index}`}
                  className="flex gap-4 border-b border-brand-border/40 pb-6"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] w-20 flex-shrink-0 bg-brand-surface overflow-hidden rounded-lg">
                    <CloudinaryImage
                      src={item.image}
                      alt={item.name}
                      width={300}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-xs font-medium">
                        <h3 className="font-sans text-xs tracking-tight uppercase text-brand-espresso font-semibold">
                          {item.name}
                        </h3>
                        <span className="font-sans font-semibold">₹{formatPrice(item.price)}</span>
                      </div>
                      <p className="mt-1 font-sans text-xxs uppercase tracking-wider text-brand-muted">
                        Size: {item.size} / Color: {item.color || "Natural"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-border bg-brand-surface/40 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-brand-surface transition-colors duration-200"
                        >
                          <Minus className="h-3 w-3 stroke-[1.25]" />
                        </button>
                        <span className="w-8 text-center font-sans text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-brand-surface transition-colors duration-200"
                        >
                          <Plus className="h-3 w-3 stroke-[1.25]" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-brand-muted hover:text-red-600 p-1 transition-colors duration-300"
                      >
                        <Trash2 className="h-4 w-4 stroke-[1.25]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-brand-border bg-brand-surface/30 px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-xs font-sans">
              <div className="flex items-center justify-between text-brand-muted">
                <span>Original Subtotal</span>
                <span>₹{formatPrice(originalTotal)}</span>
              </div>

              {bundleDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center space-x-1">
                    <Tag size={12} />
                    <span>3 for ₹999 Savings</span>
                  </span>
                  <span>-₹{formatPrice(bundleDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm uppercase font-bold text-brand-espresso pt-2 border-t border-brand-border/40">
                <span>Payable Amount</span>
                <span>₹{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate("/checkout");
              }}
              className="w-full bg-brand-espresso text-brand-bg py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest hover:bg-black transition-colors duration-300 font-sans flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
