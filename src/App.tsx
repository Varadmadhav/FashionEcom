import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchDrawer from "@/components/SearchDrawer";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ContactPage from "@/pages/ContactPage";

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <SearchProvider>
          <BrowserRouter>
            <SmoothScroll>
              <Navbar />
              <div className="flex flex-col min-h-screen flex-grow">
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </main>
              </div>
              <Footer />

              {/* Global Drawers */}
              <CartDrawer />
              <SearchDrawer />
            </SmoothScroll>
          </BrowserRouter>
        </SearchProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
