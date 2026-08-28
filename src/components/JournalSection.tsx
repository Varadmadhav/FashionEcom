"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CloudinaryImage from "./CloudinaryImage";

interface JournalArticle {
  id: string;
  image: string;
  category: string;
  title: string;
  description: string;
  href: string;
}

export default function JournalSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const articles: JournalArticle[] = [
    {
      id: "j1",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80",
      category: "Journal",
      title: "The Summer Edit",
      description: "Light, breathable & thoughtfully made for warm days.",
      href: "/shop",
    },
    {
      id: "j2",
      image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80",
      category: "Details",
      title: "In the Details",
      description: "Thoughtful finishes that make all the difference.",
      href: "/shop",
    },
    {
      id: "j3",
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
      category: "Sourcing",
      title: "A Sense of Place",
      description: "Inspired by textures, architecture & timelessness.",
      href: "/shop",
    },
  ];

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.fromTo(
        ".journal-anim",
        { opacity: 0, y: 24 },
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
      className="py-16 md:py-24 bg-brand-bg text-brand-fg border-b border-brand-border/30"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="font-serif italic text-xs text-brand-muted uppercase tracking-wider block mb-1">
              Editorial
            </span>
            <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-brand-espresso">
              From The Journal
            </h2>
          </div>
          <Link
            to="/shop"
            className="group flex items-center gap-1.5 font-sans text-xxs font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-fg transition-colors duration-300"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[1.5] group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={art.href}
              className="journal-anim flex bg-brand-surface/35 border border-brand-border/25 hover:border-brand-border hover:bg-brand-surface/50 transition-all duration-300 group h-48 md:h-52 overflow-hidden cursor-pointer"
            >
              {/* Left Column: Portrait Image */}
              <div className="w-[45%] relative h-full overflow-hidden bg-brand-surface border-r border-brand-border/20">
                <CloudinaryImage
                  src={art.image}
                  alt={art.title}
                  width={600}
                  className="h-full w-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>

              {/* Right Column: Editorial Text */}
              <div className="w-[55%] p-5 md:p-6 flex flex-col justify-between items-start h-full">
                <div className="space-y-1.5">
                  <span className="font-sans text-[9px] font-semibold uppercase tracking-widest text-brand-muted">
                    {art.category}
                  </span>
                  <h3 className="font-serif text-base md:text-lg italic tracking-wide text-brand-espresso leading-tight">
                    {art.title}
                  </h3>
                  <p className="font-sans text-[10px] tracking-wide text-brand-muted leading-relaxed font-light line-clamp-3">
                    {art.description}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1 font-sans text-[9px] font-semibold uppercase tracking-widest text-brand-espresso group-hover:text-brand-fg relative pb-0.5 mt-2 transition-colors">
                  <span>Read More</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-brand-espresso transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

