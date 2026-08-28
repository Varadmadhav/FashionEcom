import React, { useState } from "react";
import { X, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    forgotPassword,
  } = useCustomerAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (authModalMode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Invalid sign in credentials");
        }
      } else if (authModalMode === "register") {
        const res = await register(name, email, password, phone);
        if (!res.success) {
          setErrorMsg(res.error || "Failed to create account");
        }
      } else if (authModalMode === "forgot") {
        const res = await forgotPassword(email, newPassword);
        if (!res.success) {
          setErrorMsg(res.error || "Failed to reset password");
        } else {
          setSuccessMsg(res.message || "Password updated successfully!");
          setTimeout(() => {
            setAuthModalMode("login");
            setSuccessMsg(null);
          }, 1500);
        }
      }
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-brand-bg rounded-2xl shadow-2xl overflow-hidden border border-brand-fg/10 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-brand-sand/30 border-b border-brand-fg/5 text-center">
          <button
            onClick={closeAuthModal}
            className="absolute top-6 right-6 p-2 rounded-full text-brand-muted hover:text-brand-fg hover:bg-brand-fg/5 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <span className="font-serif text-2xl tracking-widest text-brand-espresso font-semibold uppercase">
            A U R E L I E
          </span>
          <p className="text-xs uppercase tracking-widest text-brand-muted mt-1">
            {authModalMode === "login"
              ? "Sign in to your account"
              : authModalMode === "register"
              ? "Create your luxury profile"
              : "Reset your password"}
          </p>

          {/* Mode Switch Tabs */}
          {authModalMode !== "forgot" && (
            <div className="flex mt-6 p-1 bg-brand-fg/5 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("login");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  authModalMode === "login"
                    ? "bg-white text-brand-espresso shadow-sm font-semibold"
                    : "text-brand-muted hover:text-brand-fg"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("register");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-lg transition ${
                  authModalMode === "register"
                    ? "bg-white text-brand-espresso shadow-sm font-semibold"
                    : "text-brand-muted hover:text-brand-fg"
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              {successMsg}
            </div>
          )}

          {authModalMode === "register" && (
            <>
              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1.5 font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                  />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aisha Kapoor"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1.5 font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                  />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso transition"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1.5 font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso transition"
              />
            </div>
          </div>

          {authModalMode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-wider text-brand-muted font-medium">
                  Password
                </label>
                {authModalMode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode("forgot");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-brand-espresso hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso transition"
                />
              </div>
            </div>
          )}

          {authModalMode === "forgot" && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1.5 font-medium">
                New Password
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso transition"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 bg-brand-espresso text-brand-bg rounded-xl font-medium text-xs uppercase tracking-widest hover:bg-black transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>
              {isSubmitting
                ? "Processing..."
                : authModalMode === "login"
                ? "Sign In"
                : authModalMode === "register"
                ? "Create Account"
                : "Reset Password"}
            </span>
            <ArrowRight size={14} />
          </button>

          {authModalMode === "forgot" && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("login");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-brand-muted hover:text-brand-fg font-medium transition"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="pt-2 flex items-center justify-center space-x-1.5 text-[11px] text-brand-muted">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>256-Bit Encrypted & Secure Checkout</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
