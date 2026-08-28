import React, { useState } from "react";
import { Lock, Mail, Shield, Key, ArrowRight, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginModal() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("aisha@aurelie.com");
  const [password, setPassword] = useState("aisha2026");
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
      setError("An error occurred during JWT login authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
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
            Admin Panel Authentication
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
              Admin Email
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
            <span>{isSubmitting ? "Authenticating..." : "Authorize Admin JWT Session"}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </form>

        {/* Demo Credentials Quick-Select */}
        <div className="pt-4 border-t border-brand-border/30 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted text-center">
            Quick Demo Accounts (Click to Fill)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill("aisha@aurelie.com", "aisha2026")}
              className="text-left p-2.5 rounded-xl border border-brand-border/30 hover:border-brand-espresso/40 hover:bg-brand-bg/50 transition-colors text-xs"
            >
              <p className="font-semibold text-brand-espresso">Aisha Kapoor</p>
              <p className="text-[10px] text-brand-muted">aisha@aurelie.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin@aurelie.com", "admin2026")}
              className="text-left p-2.5 rounded-xl border border-brand-border/30 hover:border-brand-espresso/40 hover:bg-brand-bg/50 transition-colors text-xs"
            >
              <p className="font-semibold text-brand-espresso">Aaditya Chauhan</p>
              <p className="text-[10px] text-brand-muted">admin@aurelie.com</p>
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-brand-muted pt-2">
          <Key className="w-3 h-3 text-emerald-600" />
          <span>Secured with HMAC-SHA256 JWT Token Session</span>
        </div>

      </div>
    </div>
  );
}
