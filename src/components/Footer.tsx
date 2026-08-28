"use client";

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  
  // Secret trigger state for 3-second hold on @2026
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    startTimeRef.current = Date.now();

    // Update progress bar smooth every 30ms
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(100, (elapsed / 3000) * 100);
      setHoldProgress(progress);
    }, 30);

    // After 3 seconds, redirect to Admin Page
    timerRef.current = setTimeout(() => {
      clearHold();
      navigate("/admin");
    }, 3000);
  };

  const clearHold = () => {
    setIsHolding(false);
    setHoldProgress(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const footerLinks = {
    shop: [
      { label: "All Products", href: "/shop" },
      { label: "New In", href: "/shop?filter=new" },
      { label: "Dresses", href: "/shop?category=dresses" },
      { label: "Tops", href: "/shop?category=tops" },
      { label: "Bottoms", href: "/shop?category=bottoms" },
    ],
    collections: [
      { label: "Summer Edit", href: "/shop" },
      { label: "Occasions", href: "/shop" },
      { label: "Essentials", href: "/shop" },
      { label: "Workwear", href: "/shop" },
    ],
    about: [
      { label: "Our Story", href: "/contact" },
      { label: "Craftsmanship", href: "/contact" },
      { label: "Sustainability", href: "/contact" },
      { label: "Journal", href: "/" },
    ],
    help: [
      { label: "Contact", href: "/contact" },
      { label: "Shipping", href: "/contact" },
      { label: "Returns", href: "/contact" },
      { label: "FAQ", href: "/contact" },
    ],
  };

  return (
    <footer className="bg-brand-bg text-brand-fg border-t border-brand-border/40 pt-16 pb-8 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 pb-16">
          
          {/* Logo & Statement Column */}
          <div className="col-span-2 space-y-4 pr-0 md:pr-8">
            <Link
              to="/"
              className="font-serif text-2xl font-medium tracking-[0.25em] text-brand-espresso"
            >
              AURELIE
            </Link>
            <p className="font-sans text-xxs tracking-wider uppercase text-brand-muted leading-relaxed max-w-sm">
              Contemporary designs. Timeless soul. Thoughtfully crafted silhouettes for the modern woman, built with visual restraint.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-fg transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg
                  className="h-4.5 w-4.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-fg transition-colors duration-300"
                aria-label="Pinterest"
              >
                <svg
                  className="h-4.5 w-4.5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.017 0C5.396 0 0 5.397 0 12.017c0 5.087 3.16 9.426 7.633 11.167-.105-.949-.199-2.403.041-3.437.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.993-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 12.017-5.396 12.017-12.017C24.017 5.397 18.637 0 12.017 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* SHOP Column */}
          <div className="space-y-4">
            <h3 className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso">
              Shop
            </h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-sans text-xxs text-brand-muted hover:text-brand-fg transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLLECTIONS Column */}
          <div className="space-y-4">
            <h3 className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso">
              Collections
            </h3>
            <ul className="space-y-2">
              {footerLinks.collections.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-sans text-xxs text-brand-muted hover:text-brand-fg transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ABOUT & HELP Joint Column for Mobile */}
          <div className="space-y-8 md:space-y-4">
            <div className="space-y-4">
              <h3 className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso">
                About
              </h3>
              <ul className="space-y-2">
                {footerLinks.about.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-sans text-xxs text-brand-muted hover:text-brand-fg transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-4 md:hidden">
              <h3 className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso">
                Help
              </h3>
              <ul className="space-y-2">
                {footerLinks.help.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="font-sans text-xxs text-brand-muted hover:text-brand-fg transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* HELP Column Desktop */}
          <div className="hidden md:block space-y-4">
            <h3 className="font-sans text-xxs font-bold uppercase tracking-widest text-brand-espresso">
              Help
            </h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="font-sans text-xxs text-brand-muted hover:text-brand-fg transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Legal Row with Secret 3-second hold on @2026 */}
        <div className="border-t border-brand-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative inline-block">
            <span
              onMouseDown={startHold}
              onMouseUp={clearHold}
              onMouseLeave={clearHold}
              onTouchStart={startHold}
              onTouchEnd={clearHold}
              className={`font-sans text-[10px] uppercase tracking-wider text-brand-muted cursor-pointer transition-colors duration-300 relative py-1 px-2 rounded-md ${
                isHolding ? "bg-brand-surface text-brand-espresso font-semibold" : "hover:text-brand-fg"
              }`}
              title="Hold for 3s to access Admin Portal"
            >
              &copy; {currentYear} AURELIE. ALL RIGHTS RESERVED.
              
              {/* Animated hold progress bar fill */}
              {isHolding && (
                <span
                  className="absolute bottom-0 left-0 h-[2px] bg-brand-espresso transition-all duration-75 rounded-full"
                  style={{ width: `${holdProgress}%` }}
                />
              )}
            </span>

            {/* Secret status popup during hold */}
            {isHolding && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-brand-espresso text-brand-bg text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-pulse font-mono tracking-normal">
                Verifying Admin Key... {Math.round(holdProgress)}%
              </span>
            )}
          </div>

          <div className="flex gap-6">
            <Link
              to="/contact"
              className="font-sans text-[10px] uppercase tracking-wider text-brand-muted hover:text-brand-fg transition-colors duration-300"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/contact"
              className="font-sans text-[10px] uppercase tracking-wider text-brand-muted hover:text-brand-fg transition-colors duration-300"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
