import React, { useEffect } from "react";
import { X, Tag, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export const OfferBurstModal: React.FC = () => {
  const { showBurstModal, setShowBurstModal, bundleDiscount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (showBurstModal) {
      const timer = setTimeout(() => {
        setShowBurstModal(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showBurstModal, setShowBurstModal]);

  if (!showBurstModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#F5F0E8] rounded-3xl shadow-2xl overflow-hidden border border-[#DDD3C5] transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowBurstModal(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full text-[#6B5E57] hover:text-[#2B2421] hover:bg-[#2B2421]/5 transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Left Column: Editorial Luxury Box & Garments Image */}
          <div className="md:col-span-5 relative hidden md:block bg-[#EFE7DD] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Fabric Box"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Elegant overlay watermark text */}
            <div className="absolute inset-0 bg-brand-espresso/15 flex flex-col justify-end p-6 text-[#F5F0E8]">
              <span className="font-serif text-lg font-light tracking-widest uppercase">
                A U R E L I E
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#F5F0E8]/80 font-sans">
                Rooted in Luxury
              </span>
            </div>
          </div>

          {/* Right Column: Offer Information & Actions (Matching reference image) */}
          <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-center space-y-5">
            {/* Top Floral Line Art Illustration */}
            <div className="mx-auto text-[#A67C52]">
              <svg
                className="w-10 h-10 mx-auto stroke-current"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 56V24M32 24C32 24 24 16 12 20C12 20 16 32 32 24ZM32 24C32 24 40 16 52 20C52 20 48 32 32 24ZM32 36C32 36 22 30 14 36C14 36 18 46 32 36ZM32 36C32 36 42 30 50 36C50 36 46 46 32 36Z"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Subtitle Divider */}
            <div className="flex items-center justify-center space-x-3 text-[11px] uppercase tracking-[0.25em] font-semibold text-[#A67C52]">
              <span className="w-6 h-[1px] bg-[#A67C52]/40" />
              <span>MEGA FACTORY COMBO OFFER</span>
              <span className="w-6 h-[1px] bg-[#A67C52]/40" />
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2B2421]">
              6 Kurtis for Just ₹499!
            </h2>

            {/* Subheading */}
            <p className="text-xs text-[#6B5E57] max-w-sm mx-auto leading-relaxed">
              Congratulations! You just unlocked our direct-factory 6-item mega combo deal.
            </p>

            {/* Savings Badge Pill */}
            <div className="bg-[#EFE7DD] border border-[#DDD3C5] px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 text-xs font-semibold text-[#8C5D4B] tracking-wider uppercase shadow-2xs">
              <Tag size={14} className="text-[#8C5D4B]" />
              <span>
                YOU SAVED ₹{bundleDiscount > 0 ? bundleDiscount.toLocaleString("en-IN") : "18,401"} ON THIS ORDER!
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setShowBurstModal(false);
                  setIsCartOpen(false);
                  navigate("/checkout");
                }}
                className="w-full py-3.5 bg-[#26201D] text-[#F5F0E8] rounded-xl font-semibold text-xs uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center space-x-2 shadow-md"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => {
                  setShowBurstModal(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-3 border border-[#26201D]/20 bg-transparent text-[#26201D] rounded-xl font-semibold text-xs uppercase tracking-[0.2em] hover:bg-[#26201D]/5 transition flex items-center justify-center space-x-2"
              >
                <ShoppingBag size={14} />
                <span>VIEW BAG</span>
              </button>
            </div>

            {/* Footer Check Note */}
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#7A6B63] font-semibold tracking-widest uppercase pt-1">
              <CheckCircle2 size={13} className="text-[#5B8C62]" />
              <span>DISCOUNT APPLIED AUTOMATICALLY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBurstModal;
