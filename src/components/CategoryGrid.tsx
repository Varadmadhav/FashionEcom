"use client";

import React from "react";
import { Link } from "react-router-dom";

interface CategoryItem {
  name: string;
  image: string;
  href: string;
}

export default function CategoryGrid() {
  const categories: CategoryItem[] = [
    {
      name: "Dresses",
      image: "https://images.unsplash.com/photo-1595959183075-c1d09e7e364d?auto=format&fit=crop&w=800&q=80",
      href: "/shop?category=dresses",
    },
    {
      name: "Tops",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
      href: "/shop?category=tops",
    },
    {
      name: "Bottoms",
      image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      href: "/shop?category=bottoms",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-bg text-brand-fg border-b border-brand-border/30">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Section Title */}
        <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-muted mb-8 md:mb-12">
          Shop By Category
        </h2>

        {/* Contact Sheet Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.href}
              className="group relative block aspect-[4/3] md:aspect-[3/4] overflow-hidden bg-brand-surface border border-brand-border/30 rounded-none cursor-pointer"
            >
              {/* Image with hover transition */}
              <img
                src={cat.image}
                alt={`Aurelie ${cat.name} Collection`}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
                loading="lazy"
              />

              {/* Dark vignette gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/55 via-brand-black/10 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Overlaid Label Content */}
              <div className="absolute bottom-6 left-6 text-brand-bg space-y-1 transform transition-transform duration-500 group-hover:-translate-y-1">
                <h3 className="font-serif text-2xl tracking-wider font-light uppercase">
                  {cat.name}
                </h3>
                <div className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-brand-bg/90">
                  <span>Explore</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                  <span className="block absolute left-0 bottom-0 w-0 h-[1px] bg-brand-bg transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

