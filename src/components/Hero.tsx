"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import Marquee from "./Marquee";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      {/* Background Campaign Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=1800&q=85"
          alt="Aurelie Campaign Model in Warm Ivory Silhouette"
          className="h-full w-full object-cover object-[center_35%] filter brightness-[0.88] contrast-[1.02]"
        />
        {/* Subtle radial overlay for typographic readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/40 via-transparent to-brand-black/25 z-0" />
      </div>

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
          <p className="hero-fade-sub font-sans text-xs md:text-sm tracking-wider leading-relaxed font-light text-brand-bg/90 max-w-sm pl-1">
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

