"use client";

import React from "react";
import { Feather, RotateCcw, Lock, Headphones } from "lucide-react";

export default function TrustFeatures() {
  const features = [
    {
      icon: Feather,
      title: "Premium Fabrics",
      description: "Carefully sourced, consciously chosen natural materials.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Simple and transparent returns within 7 days.",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "100% safe and trusted encryption checkout.",
    },
    {
      icon: Headphones,
      title: "Customer Care",
      description: "Thoughtful support whenever you need assistance.",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-brand-bg text-brand-fg border-b border-brand-border/30">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-brand-border/40">
          {features.map((feat, idx) => (
            <div
              key={feat.title}
              className={`flex flex-col items-center text-center p-4 ${
                idx % 2 === 0 ? "pt-4" : "pt-8 md:pt-4"
              } ${idx < 2 ? "" : "pt-8 md:pt-4"}`}
            >
              {/* Subtle Muted Icon */}
              <div className="mb-4 text-brand-muted hover:text-brand-espresso transition-colors duration-300">
                <feat.icon className="h-6 w-6 stroke-[1.25]" />
              </div>

              {/* Title & Description */}
              <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-brand-espresso mb-1">
                {feat.title}
              </h3>
              <p className="font-sans text-xxs tracking-wider text-brand-muted leading-relaxed max-w-[200px]">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

