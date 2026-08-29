"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Search, ShoppingBag, User, Menu, X, Heart, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import OfferMarquee from "./OfferMarquee";

export default function Navbar() {
  const { setIsCartOpen, cartCount } = useCart();
  const { setIsSearchOpen } = useSearch();
  const { customer, openAuthModal, logout } = useCustomerAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and account dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [pathname]);

  // Click outside to close account dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "New In", href: "/shop?filter=new" },
    { label: "Contact", href: "/contact" },
  ];

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent text-brand-bg border-transparent"
            : "bg-brand-bg/95 backdrop-blur-md text-brand-fg border-b border-brand-border"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-12 md:py-5">
          {/* Left: Mobile Menu Trigger & Main Links */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`md:hidden p-1 transition-colors duration-300 ${
                isTransparent ? "text-brand-bg hover:opacity-80" : "text-brand-muted hover:text-brand-fg"
              }`}
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5 stroke-[1.25]" />
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-sans text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-300 relative py-1 ${
                      isTransparent
                        ? "text-brand-bg hover:opacity-80"
                        : isActive
                        ? "text-brand-espresso"
                        : "text-brand-muted hover:text-brand-fg"
                    }`}
                  >
                    {link.label}
                    {isActive && !isTransparent && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-brand-espresso" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link
              to="/"
              className={`font-serif text-2xl md:text-3xl font-normal tracking-[0.25em] transition-opacity duration-300 ${
                isTransparent ? "text-brand-bg hover:opacity-90" : "text-brand-espresso hover:opacity-80"
              }`}
            >
              AURELIE
            </Link>
          </div>

          {/* Right: Actions (Search, Account, Bag) */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-1.5 p-1 font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isTransparent ? "text-brand-bg hover:opacity-80" : "text-brand-muted hover:text-brand-fg"
              }`}
              aria-label="Search"
            >
              <Search className="h-4 w-4 stroke-[1.25]" />
              <span className="hidden md:inline">Search</span>
            </button>

            {customer ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 p-1.5 rounded-lg font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                    isTransparent ? "text-brand-bg hover:opacity-80" : "text-brand-espresso hover:text-black"
                  }`}
                  aria-label="User Account"
                >
                  <User className="h-4 w-4 stroke-[1.5]" />
                  <span className="hidden md:inline max-w-[90px] truncate">{customer.name.split(" ")[0]}</span>
                </button>

                {/* Touch & Click Responsive Account Dropdown */}
                <div
                  className={`absolute right-0 top-full pt-2 w-52 z-50 transition-all duration-200 ${
                    accountMenuOpen ? "block animate-fade-in-up" : "hidden group-hover:block"
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-brand-fg/10 p-2.5 text-xs text-brand-espresso">
                    <div className="px-3 py-2 border-b border-brand-fg/10">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-[10px] text-brand-muted truncate">{customer.email}</p>
                    </div>

                    <Link
                      to="/orders?tab=orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 mt-1 rounded-xl text-brand-espresso hover:bg-brand-bg font-medium transition"
                    >
                      <ShoppingBag className="w-4 h-4 text-brand-espresso stroke-[1.5]" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/orders?tab=wishlist"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-brand-espresso hover:bg-brand-bg font-medium transition"
                    >
                      <Heart className="w-4 h-4 text-brand-espresso stroke-[1.5]" />
                      <span>My Favorites</span>
                    </Link>

                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition mt-1"
                    >
                      <LogOut className="w-4 h-4 stroke-[1.5]" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal("login")}
                className={`flex items-center gap-1.5 p-1 font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                  isTransparent ? "text-brand-bg hover:opacity-80" : "text-brand-muted hover:text-brand-fg"
                }`}
                aria-label="User Account"
              >
                <User className="h-4 w-4 stroke-[1.25]" />
                <span className="hidden md:inline">Account</span>
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className={`flex items-center gap-1.5 p-1 font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300 ${
                isTransparent ? "text-brand-bg hover:opacity-80" : "text-brand-muted hover:text-brand-fg"
              }`}
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4 stroke-[1.25]" />
              <span className="hidden md:inline">Bag </span>
              <span>({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Marquee Banner Attached to Header (Hidden on Home Page) */}
        {!isHomePage && <OfferMarquee />}
      </header>

      {/* Mobile Drawer Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-brand-bg text-brand-fg animate-fade-in md:hidden">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-brand-border px-6 py-5">
            <Link
              to="/"
              className="font-serif text-lg font-medium tracking-[0.2em] text-brand-espresso"
              onClick={() => setMobileMenuOpen(false)}
            >
              AURELIE
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1 font-sans text-xxs uppercase tracking-widest text-brand-muted hover:text-brand-fg"
            >
              <span>Close</span>
              <X className="h-4 w-4 stroke-[1.25]" />
            </button>
          </div>

          {/* Links Area */}
          <nav className="flex-1 flex flex-col justify-center px-8 space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-serif text-3xl italic text-brand-espresso hover:text-brand-muted transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Bottom Footer with Direct Account Actions */}
          <div className="border-t border-brand-border/60 px-8 py-6 bg-brand-surface/30 space-y-4">
            {customer ? (
              <div className="space-y-3">
                <div className="border-b border-brand-border/40 pb-2">
                  <p className="font-semibold text-xs text-brand-espresso">{customer.name}</p>
                  <p className="text-[10px] text-brand-muted truncate">{customer.email}</p>
                </div>
                <Link
                  to="/orders?tab=orders"
                  className="flex items-center gap-3 font-sans text-xs uppercase tracking-widest font-semibold text-brand-espresso"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/orders?tab=wishlist"
                  className="flex items-center gap-3 font-sans text-xs uppercase tracking-widest font-semibold text-brand-espresso"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="h-4 w-4 stroke-[1.5]" />
                  <span>My Favorites</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-3 font-sans text-xs uppercase tracking-widest font-semibold text-red-600 pt-1"
                >
                  <LogOut className="h-4 w-4 stroke-[1.5]" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
                className="flex items-center gap-2.5 font-sans text-xs uppercase tracking-widest font-semibold text-brand-espresso bg-brand-bg border border-brand-border/80 px-4 py-3 rounded-xl w-full justify-center"
              >
                <User className="h-4 w-4 stroke-[1.5]" />
                <span>Sign In / Create Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
