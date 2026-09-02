import React, { useState, useEffect } from "react";
import { Product } from "@/data/products";
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Image as ImageIcon,
  Camera,
  X,
  Upload,
  Sparkles,
  Filter,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import CloudinaryImage from "../CloudinaryImage";

interface ReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  size: string;
  verified: boolean;
  comment: string;
  images: string[];
  helpfulCount: number;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Pooja Sharma",
    city: "Jaipur, Rajasthan",
    rating: 5,
    date: "28 Aug 2025",
    size: "M",
    verified: true,
    comment:
      "Unbelievable quality for this price! When I saw 6 for ₹499 I thought fabric might be thin, but it is 100% pure breathable cotton with perfect stitching. Color didn't bleed after 3 washes. Highly recommended!",
    images: [
      "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    ],
    helpfulCount: 48,
  },
  {
    id: "rev-2",
    name: "Sneha Patel",
    city: "Ahmedabad, Gujarat",
    rating: 5,
    date: "24 Aug 2025",
    size: "L",
    verified: true,
    comment:
      "Got the 6-combo parcel in just 3 days! The neck embroidery is so neat and sizing is perfectly true to size. Getting 6 designer daily wear kurtis at just ₹499 is literally direct factory wholesale price. Meesho and Myntra sell the same for ₹400 each.",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
    ],
    helpfulCount: 32,
  },
  {
    id: "rev-3",
    name: "Ananya Reddy",
    city: "Hyderabad, Telangana",
    rating: 5,
    date: "19 Aug 2025",
    size: "XL",
    verified: true,
    comment:
      "Stitching and interlock finish is top notch. Soft cotton feel and elegant prints. My mother and sister shared the 6 pack and everyone loved their piece. Going to order 6 more for gifting!",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    ],
    helpfulCount: 29,
  },
  {
    id: "rev-4",
    name: "Deepika Verma",
    city: "Lucknow, UP",
    rating: 5,
    date: "12 Aug 2025",
    size: "S",
    verified: true,
    comment:
      "Superb fit! Exactly like shown in pictures. The 10% donation to girl child education also made me feel so proud ordering from Aurelie. Great initiative + unbeatable factory price!",
    images: [
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80",
    ],
    helpfulCount: 17,
  },
];

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const storageKey = `aurelie_reviews_${product.id}`;
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return DEFAULT_REVIEWS;
  });

  const [activeFilter, setActiveFilter] = useState<"all" | "images" | "5star" | "verified">("all");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ img: string; reviewer: string; comment: string } | null>(null);

  // Review Form States
  const [formRating, setFormRating] = useState<number>(5);
  const [formName, setFormName] = useState<string>("");
  const [formCity, setFormCity] = useState<string>("");
  const [formSize, setFormSize] = useState<string>("M");
  const [formComment, setFormComment] = useState<string>("");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews, storageKey]);

  // Handle Photo Upload in Review Form
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setFormImages((prev) => [...prev, String(loadEvt.target?.result)]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFormImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!formComment.trim()) {
      setFormError("Please write your review feedback.");
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: formName.trim(),
      city: formCity.trim() || "Verified Buyer",
      rating: formRating,
      date: "Today",
      size: formSize,
      verified: true,
      comment: formComment.trim(),
      images: formImages,
      helpfulCount: 1,
    };

    setReviews([newRev, ...reviews]);
    setIsWriteModalOpen(false);
    setFormName("");
    setFormCity("");
    setFormComment("");
    setFormImages([]);
    setFormError("");
  };

  // Filter Reviews
  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === "images") return r.images && r.images.length > 0;
    if (activeFilter === "5star") return r.rating === 5;
    if (activeFilter === "verified") return r.verified;
    return true;
  });

  // Extract all photos across reviews
  const allCustomerPhotos = reviews.flatMap((r) =>
    r.images.map((img) => ({
      img,
      reviewer: r.name,
      comment: r.comment,
    }))
  );

  return (
    <section className="my-12 sm:my-16 bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-brand-border/40 shadow-xs">
      
      {/* Header & Write Review Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-brand-border/30 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="text-emerald-600" />
            <span>Verified Customer Feedback</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-espresso font-normal">
            Ratings & Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
            Real photos and reviews from customers who purchased our 6 for ₹499 combo.
          </p>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="bg-brand-espresso text-brand-bg uppercase tracking-widest text-xs font-semibold px-5 py-3 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <Camera size={15} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Ratings Overview Grid (Meesho / Myntra Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-8 p-5 sm:p-6 bg-[#FAF7F2] rounded-2xl border border-brand-border/30">
        
        {/* Overall Score Card */}
        <div className="md:col-span-4 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-brand-border/30 pb-5 md:pb-0 md:pr-6">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-5xl sm:text-6xl font-bold text-brand-espresso">4.9</span>
            <span className="text-sm text-brand-muted font-sans font-medium">/ 5</span>
          </div>

          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
            ))}
          </div>

          <p className="text-xs text-brand-espresso font-semibold">
            Based on 2,840+ verified ratings
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>98% of buyers recommend this combo</span>
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-2 text-xs">
          {[
            { star: 5, pct: 88, count: "2,499" },
            { star: 4, pct: 9, count: "256" },
            { star: 3, pct: 2, count: "57" },
            { star: 2, pct: 1, count: "28" },
            { star: 1, pct: 0, count: "0" },
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-2">
              <span className="w-6 font-mono text-[11px] text-brand-espresso font-semibold flex items-center gap-0.5">
                {bar.star} <Star size={10} className="fill-amber-400 text-amber-400 inline" />
              </span>
              <div className="flex-1 bg-brand-border/40 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-[10px] text-brand-muted font-mono">{bar.count}</span>
            </div>
          ))}
        </div>

        {/* Feature Ratings (Fit, Fabric, Value) */}
        <div className="md:col-span-3 flex flex-col justify-center space-y-2.5 border-t md:border-t-0 md:border-l border-brand-border/30 pt-4 md:pt-0 md:pl-6 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-brand-muted">Fabric Quality</span>
            <span className="font-bold text-emerald-700">4.9 / 5.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-muted">True to Size</span>
            <span className="font-bold text-emerald-700">96% Fit</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-muted">Value for Money</span>
            <span className="font-bold text-emerald-700">5.0 / 5.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-muted">Color Fastness</span>
            <span className="font-bold text-emerald-700">4.8 / 5.0</span>
          </div>
        </div>

      </div>

      {/* Customer Photos Gallery Strip */}
      {allCustomerPhotos.length > 0 && (
        <div className="my-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-lg text-brand-espresso font-normal flex items-center gap-2">
              <ImageIcon size={18} className="text-amber-800" />
              <span>Customer Photos ({allCustomerPhotos.length})</span>
            </h3>
            <span className="text-xs text-brand-muted font-mono">Real Customer Uploads</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {allCustomerPhotos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhotoModal(photo)}
                className="relative flex-shrink-0 w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-brand-border/40 hover:border-brand-espresso group transition-transform hover:scale-102"
              >
                <img
                  src={photo.img}
                  alt={`Customer Photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                  <span>View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-4 pb-6 border-b border-brand-border/30">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
            activeFilter === "all"
              ? "bg-brand-espresso text-brand-bg shadow-xs"
              : "bg-[#FAF7F2] text-brand-muted hover:text-brand-espresso border border-brand-border/40"
          }`}
        >
          All Reviews ({reviews.length})
        </button>

        <button
          onClick={() => setActiveFilter("images")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
            activeFilter === "images"
              ? "bg-brand-espresso text-brand-bg shadow-xs"
              : "bg-[#FAF7F2] text-brand-muted hover:text-brand-espresso border border-brand-border/40"
          }`}
        >
          <ImageIcon size={13} />
          <span>With Photos ({reviews.filter((r) => r.images.length > 0).length})</span>
        </button>

        <button
          onClick={() => setActiveFilter("5star")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
            activeFilter === "5star"
              ? "bg-brand-espresso text-brand-bg shadow-xs"
              : "bg-[#FAF7F2] text-brand-muted hover:text-brand-espresso border border-brand-border/40"
          }`}
        >
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span>5 Star Ratings</span>
        </button>

        <button
          onClick={() => setActiveFilter("verified")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
            activeFilter === "verified"
              ? "bg-brand-espresso text-brand-bg shadow-xs"
              : "bg-[#FAF7F2] text-brand-muted hover:text-brand-espresso border border-brand-border/40"
          }`}
        >
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span>Verified Buyers</span>
        </button>
      </div>

      {/* Review Cards List */}
      <div className="divide-y divide-brand-border/30">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="py-6 space-y-3">
            {/* Reviewer Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2.5">
                {/* Rating Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-700 text-white font-mono text-xs font-bold">
                  {rev.rating} <Star size={11} className="fill-white" />
                </span>

                <span className="font-semibold text-xs text-brand-espresso">{rev.name}</span>

                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={11} />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>

              <div className="text-[11px] text-brand-muted flex items-center gap-2">
                <span>{rev.city}</span>
                <span>•</span>
                <span>Size: {rev.size}</span>
                <span>•</span>
                <span>{rev.date}</span>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-xs text-brand-fg leading-relaxed">
              {rev.comment}
            </p>

            {/* Review Attached Photos */}
            {rev.images && rev.images.length > 0 && (
              <div className="flex items-center gap-2.5 pt-1">
                {rev.images.map((imgUrl, imgIdx) => (
                  <div
                    key={imgIdx}
                    onClick={() => setSelectedPhotoModal({ img: imgUrl, reviewer: rev.name, comment: rev.comment })}
                    className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border border-brand-border/40 cursor-pointer hover:opacity-90 transition"
                  >
                    <img src={imgUrl} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {/* Helpful Counter */}
            <div className="pt-1 flex items-center gap-4 text-[11px] text-brand-muted">
              <button className="flex items-center gap-1 hover:text-brand-espresso transition">
                <ThumbsUp size={12} />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Write a Customer Review */}
      {isWriteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsWriteModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-border/40 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-brand-muted hover:text-brand-espresso"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                Customer Feedback
              </span>
              <h3 className="font-serif text-2xl text-brand-espresso">
                Write a Product Review
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Share your experience & upload photos to help other buyers.
              </p>
            </div>

            {formError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div>
                <label className="block font-semibold text-brand-espresso mb-1">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star
                        size={26}
                        className={star <= formRating ? "fill-amber-400" : "text-brand-border"}
                      />
                    </button>
                  ))}
                  <span className="font-bold text-xs text-brand-espresso ml-2">
                    {formRating === 5 ? "Excellent (5/5)" : `${formRating}/5`}
                  </span>
                </div>
              </div>

              {/* Name & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-espresso mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-brand-border/60 focus:outline-none focus:border-brand-espresso"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-espresso mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Surat, Gujarat"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-brand-border/60 focus:outline-none focus:border-brand-espresso"
                  />
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <label className="block font-semibold text-brand-espresso mb-1">
                  Size Purchased
                </label>
                <select
                  value={formSize}
                  onChange={(e) => setFormSize(e.target.value)}
                  className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-brand-border/60 focus:outline-none focus:border-brand-espresso font-semibold"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              {/* Comments */}
              <div>
                <label className="block font-semibold text-brand-espresso mb-1">
                  Review & Quality Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="How was the fabric quality, stitching, sizing, and the 6 for ₹499 pricing?"
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  className="w-full bg-white p-3 rounded-xl border border-brand-border/60 focus:outline-none focus:border-brand-espresso"
                />
              </div>

              {/* Photo Upload with Live Previews */}
              <div>
                <label className="block font-semibold text-brand-espresso mb-1">
                  Attach Real Photos (Optional)
                </label>
                
                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer border-2 border-dashed border-brand-border/80 hover:border-brand-espresso bg-white px-4 py-3 rounded-xl flex items-center gap-2 text-brand-muted hover:text-brand-espresso transition">
                    <Upload size={16} />
                    <span>Upload Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-brand-border shrink-0">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveFormImage(idx)}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-brand-espresso text-brand-bg uppercase tracking-widest text-xs font-semibold py-3.5 rounded-xl hover:bg-black transition shadow-md"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Screen Customer Photo Lightbox */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhotoModal(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition"
            >
              <X size={16} />
            </button>

            <div className="max-h-[60vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhotoModal.img}
                alt="Customer Photo"
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-brand-espresso">
                  {selectedPhotoModal.reviewer}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Buyer
                </span>
              </div>
              <p className="text-xs text-brand-muted mt-2 leading-relaxed">
                "{selectedPhotoModal.comment}"
              </p>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ProductReviews;
