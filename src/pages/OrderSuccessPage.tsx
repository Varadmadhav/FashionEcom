import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from "lucide-react";

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-brand-fg/10 text-center space-y-6">
        {/* Celebration Badge */}
        <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
          <CheckCircle size={44} className="animate-bounce" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            ORDER CONFIRMED
          </span>
          <h1 className="font-serif text-3xl font-medium text-brand-espresso mt-3">
            Thank You For Your Order!
          </h1>
          <p className="text-xs text-brand-muted mt-2">
            Your order <span className="font-mono font-bold text-brand-espresso">#{orderId}</span> has been received and is being processed.
          </p>
        </div>

        <div className="bg-brand-sand/30 p-4 rounded-2xl border border-brand-fg/5 text-left text-xs space-y-2">
          <div className="flex items-center space-x-2 text-brand-espresso font-semibold">
            <Package size={16} className="text-amber-700" />
            <span>Estimated Express Delivery</span>
          </div>
          <p className="text-brand-muted text-[11px] pl-6">
            Expected delivery within 3 - 5 business days. You can track live updates on your account page.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/orders"
            className="w-full py-3.5 bg-brand-espresso text-brand-bg rounded-xl font-medium text-xs uppercase tracking-widest hover:bg-black transition flex items-center justify-center space-x-2 shadow-md"
          >
            <span>View My Orders & Track Status</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/shop"
            className="w-full py-3 bg-brand-sand/30 text-brand-espresso rounded-xl font-medium text-xs uppercase tracking-wider hover:bg-brand-sand/60 transition flex items-center justify-center space-x-2 border border-brand-fg/10"
          >
            <ShoppingBag size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
