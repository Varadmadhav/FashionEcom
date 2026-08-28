import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { ProductStoreProvider } from "@/context/ProductStoreContext";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SearchDrawer from "@/components/SearchDrawer";
import AuthModal from "@/components/AuthModal";
import OfferBurstModal from "@/components/OfferBurstModal";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ContactPage from "@/pages/ContactPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AdminPage from "@/pages/AdminPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import CustomerOrdersPage from "@/pages/CustomerOrdersPage";

function StoreLayout() {
  return (
    <SmoothScroll>
      <Navbar />
      <div className="flex flex-col min-h-screen flex-grow">
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
      <Footer />
      {/* Global Drawers & Modals */}
      <CartDrawer />
      <SearchDrawer />
      <AuthModal />
      <OfferBurstModal />
    </SmoothScroll>
  );
}

export default function App() {
  return (
    <ProductStoreProvider>
      <CustomerAuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SearchProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Store Public & Checkout Routes */}
                    <Route element={<StoreLayout />}>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:slug" element={<ProductDetailPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                      <Route path="/orders" element={<CustomerOrdersPage />} />
                    </Route>

                    {/* Admin Portal Route */}
                    <Route path="/admin" element={<AdminPage />} />
                  </Routes>
                </BrowserRouter>
              </SearchProvider>
            </WishlistProvider>
          </CartProvider>
        </AdminAuthProvider>
      </CustomerAuthProvider>
    </ProductStoreProvider>
  );
}
