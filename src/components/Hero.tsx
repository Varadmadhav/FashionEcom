"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import Marquee from "./Marquee";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    "/hero-campaign-1.jpg",
    "/hero-campaign-2.jpg",
    "/hero-campaign-3.jpg",
  ];

  // Auto-slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useGSAP(
    () => {
      // Elegant fade-up entrance animation for the hero text
      const tl = gsap.timeline();

      tl.fromTo(
        ".hero-fade-title",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power4.out", stagger: 0.15 }
      );

      tl.fromTo(
        ".hero-fade-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        "-=0.9"
      );

      tl.fromTo(
        ".hero-fade-cta",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
        "-=0.7"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[85vh] md:min-h-screen w-full flex-col justify-between bg-brand-black/10 overflow-hidden"
    >
      {/* Background Campaign Slideshow with crossfade zoom */}
      <div className="absolute inset-0 z-0">
        {slides.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <img
              src={src}
              alt={`Aurelie Campaign Model ${idx + 1}`}
              className={`h-full w-full object-cover object-[center_top] filter brightness-[0.88] contrast-[1.02] transition-transform duration-[4000ms] ease-out ${
                idx === activeSlide ? "scale-100" : "scale-105"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Premium organic overlays for legibility (combines global dim, left gradient, bottom gradient, and top gradient for nav) */}
      <div className="absolute inset-0 bg-brand-black/24 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/55 via-brand-black/15 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-brand-black/10 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black/62 via-transparent to-transparent z-10 pointer-events-none" />

      {/* Spacer for sticky header overlay */}
      <div className="h-24 z-10" />

      {/* Main Campaign Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-12 max-w-[1440px] mx-auto w-full pb-12 md:pb-20">
        <div className="max-w-xl text-brand-bg space-y-4 md:space-y-6">
          
          {/* Main Serif Header */}
          <h1 className="font-serif text-5xl md:text-7xl font-normal leading-[1.05] tracking-wide select-none">
            <span className="hero-fade-title block">EFFORTLESSLY</span>
            <span className="hero-fade-title block italic pl-4 md:pl-8">HER</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-fade-sub font-sans text-xs md:text-sm tracking-wider leading-relaxed font-light text-brand-bg max-w-sm pl-1">
            Thoughtfully designed pieces for the modern woman. Silhouettes carved with intention, materials selected for comfort.
          </p>

          {/* Text-Link Hybrid CTA */}
          <div className="hero-fade-cta pt-2 pl-1">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 font-sans text-xxs font-semibold uppercase tracking-widest text-brand-bg relative pb-1 hover:text-brand-accent transition-colors duration-300"
            >
              <span>Explore Collection</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-bg/50 group-hover:bg-brand-accent transition-colors duration-300" />
            </Link>
          </div>

        </div>
      </div>

      {/* Slide Progress Indicators (Visual refinement) */}
      <div className="absolute right-4 md:right-12 bottom-20 md:bottom-28 z-20 flex gap-4 select-none">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className="group flex flex-col items-start gap-1 focus:outline-none cursor-pointer"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <div className="relative w-8 md:w-12 h-[1.5px] bg-brand-bg/25">
              <div
                className={`absolute inset-0 bg-brand-bg`}
                style={{
                  width: idx === activeSlide ? "100%" : "0%",
                  transitionProperty: "width",
                  transitionDuration: idx === activeSlide ? "4000ms" : "0ms",
                  transitionTimingFunction: "linear",
                }}
              />
            </div>
            <span
              className={`font-sans text-[8px] tracking-widest ${
                idx === activeSlide ? "text-brand-bg font-semibold" : "text-brand-bg/40"
              } transition-colors duration-300`}
            >
              0{idx + 1}
            </span>
          </button>
        ))}
      </div>

      {/* Mandatory Hero Marquee Banner at bottom */}
      <div className="relative z-10 w-full">
        <Marquee
          text={["Timeless Silhouettes", "Considered Details", "Made for Her"]}
          bg="bg-brand-surface"
          textColor="text-brand-fg"
        />
      </div>
    </section>
  );
}
