"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  originalTotal: number;
  bundleDiscount: number;
  cartTotal: number;
  isOfferUnlocked: boolean;
  showBurstModal: boolean;
  setShowBurstModal: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80";

const sanitizeCartItems = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && typeof item === "object")
    .map((item, idx) => ({
      id: String(item.id || item.slug || `cart-item-${idx}`),
      name: String(item.name || "Luxury Apparel Item"),
      price: Number(item.price || 0),
      size: String(item.size || "M"),
      color: String(item.color || "Natural"),
      image: item.image && typeof item.image === "string" && item.image.trim() !== "" ? item.image : DEFAULT_IMAGE,
      quantity: Math.max(1, Number(item.quantity || 1)),
    }));
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { customer, token } = useCustomerAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showBurstModal, setShowBurstModal] = useState(false);
  const prevCountRef = useRef(0);
  const isInitialMount = useRef(true);

  // Active storage key: unique per customer or guest
  const getCartKey = () => {
    return customer ? `aurelie_cart_cust_${customer.id}` : "aurelie_cart_guest";
  };

  // Load customer-specific or guest cart whenever customer session changes
  useEffect(() => {
    const currentKey = getCartKey();
    const stored = localStorage.getItem(currentKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCartItems(sanitizeCartItems(parsed));
      } catch (e) {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }

    // Sync from backend MongoDB if customer is signed in
    if (customer && token) {
      fetch("/api/customer/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && Array.isArray(data.cart)) {
            const sanitized = sanitizeCartItems(data.cart);
            setCartItems(sanitized);
            localStorage.setItem(currentKey, JSON.stringify(sanitized));
          }
        })
        .catch(() => {});
    }
  }, [customer?.id, token]);

  // Save cart & trigger offer celebration when reaching 3 items
  useEffect(() => {
    const currentKey = getCartKey();
    const sanitized = sanitizeCartItems(cartItems);

    localStorage.setItem(currentKey, JSON.stringify(sanitized));

    // Calculate total count
    const totalCount = sanitized.reduce((sum, item) => sum + item.quantity, 0);

    // Sync cart to backend MongoDB Atlas if logged in
    if (customer && token && !isInitialMount.current) {
      fetch("/api/customer/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart: sanitized }),
      }).catch(() => {});
    }

    // Trigger 3-for-999 celebration modal when totalCount increases to >= 3
    if (
      !isInitialMount.current &&
      totalCount >= 3 &&
      prevCountRef.current < 3
    ) {
      setShowBurstModal(true);
    }

    prevCountRef.current = totalCount;
    isInitialMount.current = false;
  }, [cartItems, customer?.id, token]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    const validId = String(newItem.id || `item-${Date.now()}`);
    const validSize = String(newItem.size || "M");
    const validName = String(newItem.name || "Luxury Apparel Item");
    const validPrice = Number(newItem.price || 0);
    const validImage = newItem.image && typeof newItem.image === "string" && newItem.image.trim() !== "" ? newItem.image : DEFAULT_IMAGE;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.id === validId && i.size === validSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return sanitizeCartItems(updated);
      }

      return sanitizeCartItems([
        ...prev,
        {
          id: validId,
          name: validName,
          price: validPrice,
          size: validSize,
          color: newItem.color || "Natural",
          image: validImage,
          quantity,
        },
      ]);
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, size: string) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    const currentKey = getCartKey();
    localStorage.removeItem(currentKey);
  };

  // Cart Counts & 3-for-999 Bundle Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Original un-discounted total sum
  const originalTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate 3-for-₹999 bundle logic
  const fullSetsOfThree = Math.floor(cartCount / 3);
  const remainingItemsCount = cartCount % 3;

  let computedTotal = 0;
  let computedDiscount = 0;

  if (fullSetsOfThree > 0) {
    const bundleBasePrice = fullSetsOfThree * 999;

    const allSingleItems: number[] = [];
    cartItems.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        allSingleItems.push(item.price);
      }
    });

    allSingleItems.sort((a, b) => b - a);

    const itemsInBundles = allSingleItems.slice(0, fullSetsOfThree * 3);
    const unbundledItems = allSingleItems.slice(fullSetsOfThree * 3);

    const unbundledTotal = unbundledItems.reduce((sum, p) => sum + p, 0);
    const bundledOriginalSum = itemsInBundles.reduce((sum, p) => sum + p, 0);

    computedTotal = bundleBasePrice + unbundledTotal;
    computedDiscount = Math.max(0, bundledOriginalSum - bundleBasePrice);
  } else {
    computedTotal = originalTotal;
    computedDiscount = 0;
  }

  const isOfferUnlocked = fullSetsOfThree > 0;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        originalTotal,
        bundleDiscount: computedDiscount,
        cartTotal: computedTotal,
        isOfferUnlocked,
        showBurstModal,
        setShowBurstModal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
