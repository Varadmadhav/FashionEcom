import React from "react";
import { Heart, GraduationCap, BookOpen, Users, Sparkles, Award } from "lucide-react";

export const SocialImpactBanner: React.FC = () => {
  return (
    <section className="my-12 sm:my-16 bg-gradient-to-br from-[#2D1B1E] via-[#3D2228] to-[#1F1215] text-[#FAF7F2] rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-md">
      {/* Decorative Background Accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: Main Message & Pledge */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-400/30 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
            <Heart size={13} className="fill-rose-400 text-rose-400" />
            <span>Aurelie Nari Shiksha Initiative</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight">
            10% of Your Order Goes to <br />
            <span className="italic text-rose-300">Girls' Education & Empowerment</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#E6DDD3] leading-relaxed max-w-xl font-light">
            When you purchase our direct-factory kurtis, you are not just saving money—you are directly funding school uniforms, books, and computer literacy scholarships for the young daughters of our female textile weavers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15">
              <Award size={14} className="text-amber-300" />
              <span className="font-medium">100% Audited & Direct NGO Sourced</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15">
              <Sparkles size={14} className="text-rose-300" />
              <span className="font-medium">No Extra Cost To You</span>
            </div>
          </div>
        </div>

        {/* Right Col: Impact Metrics Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 flex flex-col justify-between">
            <GraduationCap size={26} className="text-amber-300 mb-2" />
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">6,400+</div>
              <p className="text-[11px] text-[#D8CFC5] mt-1 leading-snug">
                Girls Sponsored in Elementary & High Schools
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 flex flex-col justify-between">
            <BookOpen size={26} className="text-rose-300 mb-2" />
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">18</div>
              <p className="text-[11px] text-[#D8CFC5] mt-1 leading-snug">
                Artisan Village Learning & Digital Labs
              </p>
            </div>
          </div>

          <div className="col-span-2 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300 shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-xs text-white">Supporting 1,200+ Women Weavers</h4>
              <p className="text-[11px] text-[#D8CFC5]">
                Empowering ethical livelihood & financial independence across Gujarat & Rajasthan.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SocialImpactBanner;
