"use client";

import React, { useRef, useState, useEffect } from "react";
import { Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllLink = "/shop",
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const currentProgress = (scrollLeft / maxScroll) * 100;
    setProgress(currentProgress);
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < maxScroll - 5);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      // Run once initially
      handleScroll();
      
      // Handle resize recalculation
      const handleResize = () => handleScroll();
      window.addEventListener("resize", handleResize);
      return () => {
        el.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Scroll by 75% of container width
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollTo({
      left: el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 md:py-20 bg-brand-bg text-brand-fg overflow-hidden border-b border-brand-border/30">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Title / Action Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            {subtitle && (
              <span className="font-serif italic text-xs text-brand-muted uppercase tracking-wider block mb-1">
                {subtitle}
              </span>
            )}
            <h2 className="font-sans text-lg md:text-xl font-bold uppercase tracking-widest text-brand-espresso">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to={viewAllLink}
              className="group flex items-center gap-1.5 font-sans text-xxs font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-fg transition-colors duration-300"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[1.5] group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Desktop Navigation buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`flex h-8 w-8 items-center justify-center border border-brand-border/60 hover:border-brand-muted transition-colors duration-300 ${
                  !canScrollLeft ? "opacity-35 cursor-default" : "cursor-pointer"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4 stroke-[1.25]" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`flex h-8 w-8 items-center justify-center border border-brand-border/60 hover:border-brand-muted transition-colors duration-300 ${
                  !canScrollRight ? "opacity-35 cursor-default" : "cursor-pointer"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4 stroke-[1.25]" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Tracks */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[44vw] md:w-[22%] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} variant="default" />
            </div>
          ))}
        </div>

        {/* Scroll Progress Bar Indicator */}
        <div className="mt-6 md:mt-8 flex justify-center w-full">
          <div className="relative w-40 md:w-60 h-[1.5px] bg-brand-border/40">
            <div
              className="absolute top-0 left-0 h-full bg-brand-espresso transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

