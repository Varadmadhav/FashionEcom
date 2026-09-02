import React from "react";
import { Factory, Scissors, TrendingDown, Truck, ShieldCheck, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export const DirectPricingBreakdown: React.FC = () => {
  return (
    <section className="my-12 sm:my-16 bg-[#FAF7F2] rounded-3xl p-5 sm:p-8 md:p-10 border border-brand-border/40 shadow-xs">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-3">
          <Sparkles size={12} className="text-amber-700" />
          <span>Factory-to-Consumer Revolution</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-brand-espresso font-normal leading-tight">
          How We Deliver 6 Kurtis for Just ₹499
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
          Wondering how we offer premium pure cotton kurtis at just <span className="font-bold text-brand-espresso">₹83 per piece</span>? Here is our zero-middlemen breakdown.
        </p>
      </div>

      {/* Comparison Grid: Traditional vs Aurelie Factory Direct */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        
        {/* Traditional Retail Card */}
        <div className="bg-white/80 rounded-2xl p-5 sm:p-6 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <span className="font-sans text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle size={15} className="text-rose-600" />
                Traditional Retail Stores
              </span>
              <span className="font-mono text-sm line-through text-rose-400 font-bold">
                ₹2,999 – ₹4,500
              </span>
            </div>

            <ul className="mt-4 space-y-3 text-xs text-brand-muted">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold text-sm leading-none">•</span>
                <span><strong className="text-brand-espresso">Raw Material Brokers (+20%):</strong> Multiple agents buying & trading cloth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold text-sm leading-none">•</span>
                <span><strong className="text-brand-espresso">Wholesalers & Distributors (+35%):</strong> Intermediary warehouse markups.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold text-sm leading-none">•</span>
                <span><strong className="text-brand-espresso">Luxury Mall Rents & AC (+45%):</strong> High store overheads passed to you.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold text-sm leading-none">•</span>
                <span><strong className="text-brand-espresso">Celebrity Endorsements (+30%):</strong> Massive advertising budgets.</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-rose-100 text-center">
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
              You pay 85% extra in middleman commissions
            </span>
          </div>
        </div>

        {/* Aurelie Factory Direct Card */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/60 rounded-2xl p-5 sm:p-6 border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-600 text-white font-mono text-[10px] font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
            Best Value Guaranteed
          </div>

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <span className="font-sans text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Aurelie Factory Direct
              </span>
              <div className="text-right">
                <span className="font-serif text-lg sm:text-xl font-bold text-emerald-900">
                  6 for ₹499
                </span>
                <span className="block text-[10px] font-sans text-emerald-700 font-semibold">(₹83 / Kurti)</span>
              </div>
            </div>

            <ul className="mt-4 space-y-3 text-xs text-brand-fg">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                <span><strong className="text-brand-espresso">Direct In-House Weaving:</strong> 50,000+ meters woven daily at our Gujarat mills.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                <span><strong className="text-brand-espresso">Automated Laser Cutting:</strong> Zero fabric wastage with Japanese precision machines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                <span><strong className="text-brand-espresso">Zero Middlemen:</strong> Direct from the master tailor to our central online warehouse.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                <span><strong className="text-brand-espresso">Direct-to-Doorstep Dispatch:</strong> Express shipping directly to your home.</span>
              </li>
            </ul>
          </div>

          <div className="mt-5 pt-3 border-t border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <span>Pure Mill-Direct Pricing — You Save ₹2,500+</span>
            </span>
          </div>
        </div>

      </div>

      {/* 4 Pillar Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-brand-border/30">
        <div className="bg-white/70 p-3.5 rounded-xl text-center border border-brand-border/30">
          <Factory size={22} className="mx-auto text-amber-800 mb-1.5" />
          <h4 className="font-semibold text-xs text-brand-espresso">In-House Mills</h4>
          <p className="text-[10px] text-brand-muted mt-0.5">Gujarat & Surat Plants</p>
        </div>

        <div className="bg-white/70 p-3.5 rounded-xl text-center border border-brand-border/30">
          <Scissors size={22} className="mx-auto text-amber-800 mb-1.5" />
          <h4 className="font-semibold text-xs text-brand-espresso">Laser Precision</h4>
          <p className="text-[10px] text-brand-muted mt-0.5">Under 1.2% Fabric Waste</p>
        </div>

        <div className="bg-white/70 p-3.5 rounded-xl text-center border border-brand-border/30">
          <TrendingDown size={22} className="mx-auto text-emerald-700 mb-1.5" />
          <h4 className="font-semibold text-xs text-brand-espresso">0% Broker Fee</h4>
          <p className="text-[10px] text-brand-muted mt-0.5">100% Direct To You</p>
        </div>

        <div className="bg-white/70 p-3.5 rounded-xl text-center border border-brand-border/30">
          <Truck size={22} className="mx-auto text-amber-800 mb-1.5" />
          <h4 className="font-semibold text-xs text-brand-espresso">Direct Dispatch</h4>
          <p className="text-[10px] text-brand-muted mt-0.5">Fast Doorstep Delivery</p>
        </div>
      </div>
    </section>
  );
};

export default DirectPricingBreakdown;
