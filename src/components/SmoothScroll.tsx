"use client";

import React, { useEffect, useRef } from "react";
import { ReactLenis } from "lenis/react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);
  const { pathname } = useLocation();

  // Scroll to top automatically on route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  useEffect(() => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Sync GSAP ticker with Lenis raf updates
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // Update ScrollTrigger on scroll
    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      lenisInstance.on("scroll", () => {
        ScrollTrigger.update();
      });
    }

    return () => {
      gsap.ticker.remove(update);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false, // Let GSAP handle the requestAnimationFrame loop
        lerp: 0.1,
        duration: 1.2,
        syncTouch: false,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

