"use client";

import React from "react";

interface MarqueeProps {
  text: string[];
  bg?: string;
  textColor?: string;
  reverse?: boolean;
}

export default function Marquee({
  text,
  bg = "bg-brand-surface",
  textColor = "text-brand-fg",
  reverse = false,
}: MarqueeProps) {
  const content = text.join("   ·   ");

  return (
    <div className={`w-full overflow-hidden border-y border-brand-border/40 py-3 md:py-4 ${bg} ${textColor}`}>
      <div className="relative flex max-w-full overflow-x-hidden select-none">
        <div
          className={`flex whitespace-nowrap gap-16 pr-16 font-sans text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] ${
            reverse ? "animate-marquee-slow-reverse" : "animate-marquee-slow"
          } motion-reduce:animate-none`}
        >
          {/* Render multiple segments to ensure a seamless looping visual across extra-wide viewports */}
          <span>{content}</span>
          <span>{content}</span>
          <span>{content}</span>
          <span>{content}</span>
        </div>
      </div>
    </div>
  );
}

