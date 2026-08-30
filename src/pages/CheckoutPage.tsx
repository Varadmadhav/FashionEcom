import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { API_BASE } from "@/utils/api";
import CloudinaryImage from "@/components/CloudinaryImage";
import {
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Tag,
  Phone,
  User,
  Home,
} from "lucide-react";

export const CheckoutPage: React.FC = () => {
  const { cartItems, originalTotal, bundleDiscount, cartTotal, clearCart } = useCart();
  const { customer, isAuthenticated, openAuthModal } = useCustomerAuth();
  const navigate = useNavigate();

  // Redirect to shop if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/shop");
    }
  }, [cartItems, navigate]);

  // Form State
  const [fullName, setFullName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Razorpay" | "COD">("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName || !email || !phone || !street || !city || !pincode) {
      setErrorMsg("Please complete all required shipping address fields.");
      return;
    }

    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerId: customer?.id,
        customerName: fullName,
        email: email.toLowerCase().trim(),
        phone,
        shippingAddress: {
          fullName,
          phone,
          street,
          city,
          state,
          pincode,
        },
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal: originalTotal,
        discount: bundleDiscount,
        total: cartTotal,
        paymentMethod,
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to place order. Please try again.");
      }

      // Clear customer cart and navigate to success page
      clearCart();
      navigate(`/order-success/${data.data.id || data.data._id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong while placing your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg pt-36 md:pt-44 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-fg/10">
          <Link
            to="/shop"
            className="flex items-center space-x-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-fg transition font-medium"
          >
            <ArrowLeft size={14} />
            <span>Back to Store</span>
          </Link>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-semibold">
            <ShieldCheck size={16} />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form (Address & Payment) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Shipping Address */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-brand-fg/10">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-brand-fg/5">
                <div className="w-8 h-8 rounded-full bg-brand-espresso text-brand-bg flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-brand-espresso">
                    Shipping Address
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Enter the destination address for express delivery
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1 font-medium">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-brand-bg/50 border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1 font-medium">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-brand-bg/50 border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1 font-medium">
                    Street Address / House No. *
                  </label>
                  <div className="relative">
                    <Home size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Flat 402, Building A, MG Road"
                      className="w-full pl-10 pr-4 py-2.5 bg-brand-bg/50 border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1 font-medium">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-4 py-2.5 bg-brand-bg/50 border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-brand-muted mb-1 font-medium">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-4 py-2.5 bg-brand-bg/50 border border-brand-fg/15 rounded-xl text-sm focus:outline-none focus:border-brand-espresso"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-brand-fg/10">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-brand-fg/5">
                <div className="w-8 h-8 rounded-full bg-brand-espresso text-brand-bg flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h2 className="font-serif text-xl font-medium text-brand-espresso">
                    Payment Method
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Select your preferred payment option
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Razorpay Online */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "Razorpay"
                      ? "border-brand-espresso bg-amber-50/40 shadow-xs"
                      : "border-brand-fg/15 hover:bg-brand-bg/40"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Razorpay"}
                      onChange={() => setPaymentMethod("Razorpay")}
                      className="accent-brand-espresso"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-espresso flex items-center gap-2">
                        <span>Razorpay Secure Online Payment</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                          Cards / UPI / NetBanking
                        </span>
                      </p>
                      <p className="text-xs text-brand-muted">
                        Pay safely using GPay, PhonePe, Cards or NetBanking
                      </p>
                    </div>
                  </div>
                  <CreditCard size={20} className="text-brand-muted" />
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === "COD"
                      ? "border-brand-espresso bg-amber-50/40 shadow-xs"
                      : "border-brand-fg/15 hover:bg-brand-bg/40"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-brand-espresso"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-espresso">
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-brand-muted">
                        Pay in cash upon doorstep delivery
                      </p>
                    </div>
                  </div>
                  <Truck size={20} className="text-brand-muted" />
                </label>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-brand-espresso text-brand-bg rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-black transition flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
              >
                <Lock size={14} />
                <span>
                  {isSubmitting ? "Processing Order..." : `Place Order (₹${cartTotal.toLocaleString("en-IN")})`}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & 3-for-999 Savings */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-brand-fg/10 sticky top-24 space-y-6">
              <h3 className="font-serif text-lg font-semibold text-brand-espresso border-b border-brand-fg/10 pb-3">
                Order Summary ({cartItems.length} items)
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-4 pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3">
                    <div className="w-14 h-18 bg-brand-sand/30 rounded-lg overflow-hidden shrink-0">
                      <CloudinaryImage src={item.image} alt={item.name} width={100} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-espresso truncate">{item.name}</p>
                      <p className="text-[11px] text-brand-muted">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-brand-espresso font-mono">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 pt-4 border-t border-brand-fg/10 text-xs font-sans">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span>₹{originalTotal.toLocaleString("en-IN")}</span>
                </div>

                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="flex items-center space-x-1">
                      <Tag size={14} />
                      <span>3 for ₹999 Bundle Offer</span>
                    </span>
                    <span>-₹{bundleDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-muted">
                  <span>Express Shipping</span>
                  <span className="text-emerald-700 font-semibold uppercase">Free</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-brand-espresso pt-3 border-t border-brand-fg/10">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
