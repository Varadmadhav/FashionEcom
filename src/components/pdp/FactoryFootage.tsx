import React, { useState } from "react";
import { Play, Pause, Video, Eye, CheckCircle, ShieldCheck, X, Maximize2 } from "lucide-react";

interface FactoryClip {
  id: string;
  title: string;
  location: string;
  description: string;
  duration: string;
  videoUrl: string;
  posterUrl: string;
  badge: string;
}

export const FactoryFootage: React.FC = () => {
  const [activeModalVideo, setActiveModalVideo] = useState<FactoryClip | null>(null);

  const factoryClips: FactoryClip[] = [
    {
      id: "clip-1",
      title: "Automated Laser Fabric Cutting",
      location: "Surat Manufacturing Unit #2",
      description: "Layering 500+ fabric sheets with computerized laser cutting for 100% exact sizing accuracy.",
      duration: "0:18",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-working-on-a-garment-41584-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      badge: "Plant 01: Sizing",
    },
    {
      id: "clip-2",
      title: "Multi-Head Artisan Embroidery",
      location: "Jaipur Craftsmanship Hub",
      description: "High-speed precision embroidery machines stitching intricate zari and resham motifs.",
      duration: "0:22",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-sewing-machine-needle-in-motion-41582-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80",
      badge: "Plant 02: Embroidery",
    },
    {
      id: "clip-3",
      title: "Master Tailor Double-Stitch Hems",
      location: "Surat Assembly Line B",
      description: "Reinforced seam stitching and hand quality checks by skilled women artisans.",
      duration: "0:15",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-tailor-working-with-cloth-and-sewing-machine-41580-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      badge: "Plant 03: Tailoring",
    },
    {
      id: "clip-4",
      title: "Steam Press & Direct Packaging",
      location: "Central Fulfillment Hub",
      description: "Individual steam press, thread inspection, and eco-friendly packing for instant dispatch.",
      duration: "0:20",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tailor-working-with-scissors-and-measuring-tape-41581-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
      badge: "Plant 04: Quality Check",
    },
  ];

  return (
    <section className="my-12 sm:my-16 bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-brand-border/40 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-brand-border/30 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Video size={13} className="text-rose-600" />
            <span>Behind The Scenes • 100% Transparency</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-espresso font-normal">
            Real Footage from Our Factory
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
            Watch our direct manufacturing units in Gujarat and Rajasthan creating your kurtis with authentic craftsmanship.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl shrink-0">
          <CheckCircle size={15} className="text-emerald-600" />
          <span>ISO 9001 Certified Factory</span>
        </div>
      </div>

      {/* Video Grid (Mobile 1 col, Desktop 2 or 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {factoryClips.map((clip) => (
          <div
            key={clip.id}
            className="group bg-[#FAF7F2] rounded-2xl overflow-hidden border border-brand-border/40 hover:border-brand-espresso/60 transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md"
          >
            {/* Video Container */}
            <div
              className="relative aspect-video sm:aspect-[4/3] bg-black cursor-pointer overflow-hidden"
              onClick={() => setActiveModalVideo(clip)}
            >
              <video
                src={clip.videoUrl}
                poster={clip.posterUrl}
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              />

              {/* Plant Badge */}
              <div className="absolute top-2.5 left-2.5 bg-brand-espresso/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {clip.badge}
              </div>

              {/* Duration Pill */}
              <div className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                {clip.duration}
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="w-11 h-11 rounded-full bg-white/90 group-hover:bg-white text-brand-espresso flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all">
                  <Play size={18} className="fill-brand-espresso ml-0.5" />
                </div>
              </div>

              {/* Live Tap to Enlarge Indicator */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white/90 text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Maximize2 size={10} />
                <span>Tap to Expand</span>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs text-brand-espresso line-clamp-1">
                  {clip.title}
                </h4>
                <p className="text-[11px] font-mono text-amber-800/90 mt-0.5">
                  {clip.location}
                </p>
                <p className="text-[11px] text-brand-muted mt-1.5 leading-relaxed line-clamp-2">
                  {clip.description}
                </p>
              </div>

              <button
                onClick={() => setActiveModalVideo(clip)}
                className="mt-3 w-full py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-espresso hover:text-white bg-brand-espresso/5 hover:bg-brand-espresso rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Eye size={12} />
                <span>Watch Clip</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Video Lightbox Modal */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModalVideo(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalVideo(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
            >
              <X size={16} />
            </button>

            {/* Modal Video Player */}
            <div className="relative aspect-video bg-black">
              <video
                src={activeModalVideo.videoUrl}
                poster={activeModalVideo.posterUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                  {activeModalVideo.badge}
                </span>
                <span className="text-xs text-brand-muted font-mono">{activeModalVideo.location}</span>
              </div>
              <h3 className="font-serif text-xl text-brand-espresso mt-2">
                {activeModalVideo.title}
              </h3>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                {activeModalVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FactoryFootage;
