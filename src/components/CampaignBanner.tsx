"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import CloudinaryImage from "./CloudinaryImage";

export default function CampaignBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Section entrance slide-up transition
      gsap.fromTo(
        ".campaign-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden border-b border-brand-border/30 bg-brand-bg text-brand-fg"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-12 md:py-20">
        <div className="flex flex-col md:flex-row h-auto md:h-[480px] border border-brand-border/40 overflow-hidden">
          
          {/* Left Text Block - Deep Espresso/Warm Taupe Contrast panel */}
          <div className="w-full md:w-[40%] bg-brand-espresso text-brand-bg p-8 md:p-12 flex flex-col justify-between items-start gap-8 min-h-[300px] md:min-h-0 campaign-anim">
            <div className="space-y-4">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-muted block">
                Seasonal Feature
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight tracking-wide">
                THE NEW <br />
                <span className="italic">SEASON</span>
              </h2>
              <p className="font-sans text-xs md:text-sm tracking-wider leading-relaxed text-brand-bg/85 max-w-xs font-light pt-2">
                Discover pieces that move with you, through every single moment. Effortless silhouettes tailored for contemporary ease.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 font-sans text-xxs font-semibold uppercase tracking-widest text-brand-bg relative pb-1 hover:text-brand-accent transition-colors duration-300"
              >
                <span>Explore the Collection</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                  &rarr;
                </span>
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-bg/40 group-hover:bg-brand-accent transition-colors duration-300" />
              </Link>
            </div>
          </div>

          {/* Right Photographic Block */}
          <div className="w-full md:w-[60%] aspect-[4/3] md:aspect-auto relative bg-brand-surface campaign-anim">
            {/* Desktop Landscape Crop */}
            <CloudinaryImage
              src="https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=1200&q=80"
              alt="Aurelie Campaign Close-up Fabric Details"
              width={1200}
              className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

