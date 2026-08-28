"use client";

import React from "react";
import Hero from "@/components/Hero";
import BrandStatement from "@/components/BrandStatement";
import ProductCarousel from "@/components/ProductCarousel";
import EditorialStory from "@/components/EditorialStory";
import CategoryGrid from "@/components/CategoryGrid";
import Marquee from "@/components/Marquee";
import CampaignBanner from "@/components/CampaignBanner";
import TrustFeatures from "@/components/TrustFeatures";
import JournalSection from "@/components/JournalSection";
import Newsletter from "@/components/Newsletter";
import { useProductStore } from "@/context/ProductStoreContext";

export default function HomePage() {
  const { getNewArrivals, allProducts } = useProductStore();

  // New Arrivals: sorted by addedAt desc, persist until badge removed
  const newInProducts = getNewArrivals();
  const justInProducts = allProducts
    .filter((p) => !p.badges?.includes("New Arrival") && !p.newArrival)
    .slice(0, 6);

  return (
    <div className="w-full bg-brand-bg text-brand-fg">
      {/* 01 — Hero banner section with overlay header and looping marquee */}
      <Hero />

      {/* 02 — Editorial pause / brand value statement */}
      <BrandStatement />

      {/* 03 — Featured New In products carousel */}
      <ProductCarousel
        title="New In"
        subtitle="The Latest Arrivals"
        products={newInProducts}
        viewAllLink="/shop?filter=new"
      />

      {/* 04 — Asymmetric Brand Story with GSAP parallax */}
      <EditorialStory />

      {/* 05 — Category grids */}
      <CategoryGrid />

      {/* 06 — Second product carousel */}
      <ProductCarousel
        title="Just In"
        subtitle="Studio Favorites"
        products={justInProducts}
        viewAllLink="/shop"
      />

      {/* 07 — Second high-contrast dark marquee */}
      <Marquee
        text={["Crafted with Intention", "Quiet Confidence", "Modern Femininity"]}
        bg="bg-brand-espresso"
        textColor="text-brand-bg"
        reverse={true}
      />

      {/* 08 — Split Campaign banner */}
      <CampaignBanner />

      {/* 09 — Trust badges and credit policies */}
      <TrustFeatures />

      {/* 10 — Fashion Journal Grid articles */}
      <JournalSection />

      {/* 11 — Clean minimalist newsletter signup */}
      <Newsletter />
    </div>
  );
}
