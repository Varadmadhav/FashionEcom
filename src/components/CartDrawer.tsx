"use client";

import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLenis } from "lenis/react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";


export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useCart();
  const lenis = useLenis();

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
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">
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

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-8 w-8 stroke-[1] text-brand-muted" />
              <p className="font-serif text-lg italic text-brand-muted">Your bag is empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 font-sans text-xs uppercase tracking-widest underline decoration-brand-border underline-offset-4 hover:text-brand-muted transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 border-b border-brand-border/40 pb-6">
                  {/* Image */}
                  <div className="relative aspect-[3/4] w-20 flex-shrink-0 bg-brand-surface overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between text-xs font-medium">
                        <h3 className="font-sans text-xs tracking-tight uppercase text-brand-espresso">{item.name}</h3>
                        <span className="font-sans">₹{item.price.toLocaleString("en-IN")}</span>
                      </div>
                      <p className="mt-1 font-sans text-xxs uppercase tracking-wider text-brand-muted">
                        Size: {item.size} / Color: {item.color}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-brand-border bg-brand-surface/40">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-brand-surface transition-colors duration-200"
                        >
                          <Minus className="h-3 w-3 stroke-[1.25]" />
                        </button>
                        <span className="w-8 text-center font-sans text-xs">{item.quantity}</span>
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
                        className="text-brand-muted hover:text-brand-espresso p-1 transition-colors duration-300"
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
          <div className="border-t border-brand-border bg-brand-surface/30 px-6 py-6 space-y-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider">
              <span className="font-sans font-medium text-brand-muted">Subtotal</span>
              <span className="font-sans font-bold text-brand-espresso text-sm">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="font-sans text-xxs text-brand-muted">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={() => alert("Proceeding to checkout...")}
              className="w-full bg-brand-espresso text-brand-bg py-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand-black transition-colors duration-300 font-sans"
            >
              Checkout
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-center font-sans text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-fg transition-colors duration-300 py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

