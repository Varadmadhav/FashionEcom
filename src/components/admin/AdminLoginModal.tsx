import React, { useState } from "react";
import { Lock, Mail, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginModal() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 select-none">
      <div className="bg-white/90 backdrop-blur-xl max-w-md w-full rounded-3xl p-8 shadow-2xl border border-brand-border/40 space-y-8 animate-scaleUp">
        
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5C1D24]/10 text-[#5C1D24] mb-2">
            <Shield className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="font-serif text-3xl tracking-[0.2em] text-brand-espresso font-medium uppercase">
            Aurelie
          </h1>
          <p className="font-sans text-[11px] font-bold tracking-widest text-brand-muted uppercase">
            Admin Sign In
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-brand-espresso uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurelie.com"
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/30 text-brand-espresso font-medium transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-brand-espresso uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-brand-border/50 focus:border-brand-espresso focus:outline-none bg-brand-bg/30 text-brand-espresso font-medium transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#5C1D24] text-white py-3.5 px-6 rounded-xl font-sans text-xs uppercase tracking-widest font-semibold hover:bg-[#4A151B] transition-colors flex items-center justify-center gap-2 group shadow-sm disabled:opacity-70"
          >
            <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>

      </div>
    </div>
  );
}
