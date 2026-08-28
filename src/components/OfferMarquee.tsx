import React from "react";
import LogoLoop, { LogoItem } from "./LogoLoop";
import { Sparkles, Flame, Tag, ShieldCheck } from "lucide-react";

export const OfferMarquee: React.FC = () => {
  const marqueeItems: LogoItem[] = [
    {
      node: (
        <span className="flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-medium text-[#F7F3ED]">
          <span className="font-serif font-bold italic text-amber-300">EXCLUSIVE BUNDLE</span>
          <span className="text-amber-400/50">•</span>
          <span className="font-sans font-bold text-white tracking-widest">BUY 3 ITEMS FOR JUST ₹999!</span>
        </span>
      ),
    },
    {
      node: (
        <span className="flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-medium text-[#F7F3ED]">
          <span className="text-amber-400/50">•</span>
          <span className="font-sans font-semibold text-amber-200">AUTOMATIC DISCOUNT AT CHECKOUT</span>
        </span>
      ),
    },
    {
      node: (
        <span className="flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-medium text-[#F7F3ED]">
          <span className="text-amber-400/50">•</span>
          <span className="font-sans font-medium text-[#F7F3ED]/90">FREE EXPRESS SHIPPING ON ALL ORDERS</span>
        </span>
      ),
    },
    {
      node: (
        <span className="flex items-center space-x-3 text-xs uppercase tracking-[0.25em] font-medium text-[#F7F3ED]">
          <span className="font-serif italic font-bold tracking-[0.3em] text-amber-300">A U R E L I E</span>
          <span className="text-amber-400/50">•</span>
          <span className="font-sans font-medium text-[#F7F3ED]/90">CRAFTED LUXURY APPAREL</span>
        </span>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#12100E] border-b border-amber-900/20 py-4 overflow-hidden select-none shadow-md">
      <LogoLoop
        logos={marqueeItems}
        speed={60}
        direction="left"
        gap={56}
        logoHeight={32}
        pauseOnHover
        scaleOnHover={false}
        fadeOut
        fadeOutColor="#12100E"
        ariaLabel="Store promotions and offer announcements"
      />
    </div>
  );
};

export default OfferMarquee;
