"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useSearch } from "@/context/SearchContext";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { setIsCartOpen, cartCount } = useCart();
  const { setIsSearchOpen } = useSearch();
  const location = useLocation();
  const pathname = location.pathname;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Shop", href: "/shop" },
    { label: "New In", href: "/shop?filter=new" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-brand-bg/92 backdrop-blur-[6px] border-b border-brand-border/40 py-4 shadow-sm"
            : "bg-transparent py-5 md:py-6"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex items-center justify-between">
          
          {/* Desktop Left Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="font-sans text-[11px] font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-fg transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1 text-brand-fg hover:text-brand-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 stroke-[1.25]" />
          </button>

          {/* Center Brand Logo Wordmark */}
          <Link
            to="/"
            className="font-serif text-lg md:text-2xl font-medium tracking-[0.25em] text-brand-espresso hover:opacity-85 transition-opacity"
          >
            AURELIE
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 p-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-fg transition-colors"
              aria-label="Search items"
            >
              <Search className="h-4 w-4 stroke-[1.25]" />
              <span className="hidden md:inline">Search</span>
            </button>

            <Link
              to="/contact"
              className="hidden md:flex items-center gap-1.5 p-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-fg transition-colors"
              aria-label="User Account"
            >
              <User className="h-4 w-4 stroke-[1.25]" />
              <span>Account</span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-1.5 p-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-fg transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-4 w-4 stroke-[1.25]" />
              <span>Bag ({cartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
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
          <nav className="flex-1 flex flex-col justify-center px-8 space-y-8">
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

          {/* Mobile Bottom Footer */}
          <div className="border-t border-brand-border/60 px-8 py-8 bg-brand-surface/30 space-y-4">
            <Link
              to="/contact"
              className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-brand-espresso"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="h-4.5 w-4.5 stroke-[1.25]" />
              <span>My Account</span>
            </Link>
            <div className="pt-2 text-xxs text-brand-muted tracking-wider leading-relaxed">
              <p>CUSTOMER CARE: hello@aurelie.com</p>
              <p>MON — SAT: 10:00 — 18:00 IST</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

