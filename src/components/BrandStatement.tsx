"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function BrandStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".statement-anim",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
      className="pt-6 pb-20 md:py-36 bg-brand-bg text-brand-fg border-b border-brand-border/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col md:flex-row items-start justify-between gap-8 md:gap-16">
        
        {/* Left column: Tiny Label */}
        <div className="w-full md:w-1/4 statement-anim">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-muted block">
            The Studio Viewpoint
          </span>
        </div>

        {/* Center/Right column: Large Statement and Paragraph */}
        <div className="w-full md:w-3/4 max-w-2xl space-y-6 md:space-y-8">
          <h2 className="statement-anim font-serif text-3xl md:text-5xl font-light leading-[1.1] tracking-wide text-brand-espresso">
            DESIGNED <br />
            TO FEEL <br />
            <span className="italic">LIKE YOU.</span>
          </h2>
          
          <p className="statement-anim font-sans text-xs md:text-sm tracking-wider leading-relaxed text-brand-muted max-w-lg font-light pl-0.5">
            Contemporary silhouettes, considered fabrics, and thoughtful details designed for everyday elegance. We believe garments should move with you, serving as an extension of your quiet confidence.
          </p>
        </div>

      </div>
    </section>
  );
}

