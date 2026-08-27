"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

export default function EditorialStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // Controlled subtle parallax effect on scroll
      gsap.fromTo(
        imgRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: imgContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );

      // Fade up elements inside the text column
      gsap.fromTo(
        ".story-fade",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-28 bg-brand-bg text-brand-fg overflow-hidden border-b border-brand-border/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-center gap-12 md:gap-16">
        
        {/* Left Column: Text Content */}
        <div className="w-full md:w-[45%] space-y-6 md:space-y-8 order-2 md:order-1">
          <div className="space-y-2.5">
            <span className="story-fade font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-muted block">
              Our Approach
            </span>
            <h2 className="story-fade font-serif text-3xl md:text-4xl font-light leading-tight text-brand-espresso">
              The art of <br />
              <span className="italic">everyday elegance.</span>
            </h2>
          </div>

          <p className="story-fade font-sans text-xs md:text-sm tracking-wider leading-relaxed text-brand-muted max-w-md font-light">
            Rooted in thoughtful design and contemporary femininity, each piece is created to be lived in, loved, and remembered. We focus on visual restraint, premium fabrications, and clean lines to deliver effortless, contemporary luxury.
          </p>

          <div className="story-fade pt-2">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 font-sans text-xxs font-semibold uppercase tracking-widest text-brand-espresso relative pb-1 hover:text-brand-muted transition-colors duration-300"
            >
              <span>Discover Our Story</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-espresso/30 group-hover:bg-brand-muted transition-colors duration-300" />
            </Link>
          </div>
        </div>

        {/* Right Column: Parallax Image Showcase */}
        <div
          ref={imgContainerRef}
          className="w-full md:w-[55%] aspect-[4/3] md:aspect-[1.4] overflow-hidden relative bg-brand-surface border border-brand-border/20 order-1 md:order-2"
        >
          <img
            ref={imgRef}
            src="https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=1200&q=80"
            alt="Minimalistic Aurelie Campaign Shoot Details"
            className="absolute top-0 left-0 w-full h-[120%] -top-[10%] object-cover object-center scale-102"
          />
        </div>

      </div>
    </section>
  );
}

