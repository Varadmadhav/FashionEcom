import React, { useEffect, useState } from "react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { API_BASE } from "@/utils/api";
import { useWishlist } from "@/context/WishlistContext";
import { useProductStore } from "@/context/ProductStoreContext";
import { Link, useSearchParams } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ShoppingBag,
  ChevronRight,
  Heart,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

interface OrderItem {
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Pending" | "Packed" | "Out for Delivery" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

export const CustomerOrdersPage: React.FC = () => {
  const { customer, isAuthenticated, openAuthModal } = useCustomerAuth();
  const { wishlist } = useWishlist();
  const { allProducts } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist">(
    tabParam === "wishlist" ? "wishlist" : "orders"
  );

  useEffect(() => {
    if (tabParam === "wishlist") {
      setActiveTab("wishlist");
    } else if (tabParam === "orders") {
      setActiveTab("orders");
    }
  }, [tabParam]);

  const handleTabChange = (tab: "orders" | "wishlist") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const favoriteProducts = (allProducts || []).filter((p) => wishlist.includes(p.id));

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      try {
        const token = localStorage.getItem("aurelie_customer_jwt");
        const res = await fetch(`${API_BASE}/orders/my-orders`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-fg flex items-center justify-center pt-36 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-brand-fg/10 space-y-4">
          <Heart size={40} className="mx-auto text-brand-espresso" />
          <h2 className="font-serif text-2xl text-brand-espresso">
            Please Sign In
          </h2>
          <p className="text-xs text-brand-muted">
            Sign in to view your private order history and saved favorites list.
          </p>
          <button
            onClick={() => openAuthModal("login")}
            className="w-full py-3.5 bg-brand-espresso text-brand-bg rounded-xl font-semibold text-xs uppercase tracking-widest hover:bg-black transition"
          >
            Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Packed":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-fg pt-36 md:pt-44 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-fg/10 pb-6 gap-4">
          <div>
            <h1 className="font-serif text-3xl font-medium text-brand-espresso">
              My Account & Activity
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Welcome back, <span className="font-semibold text-brand-espresso">{customer?.name}</span>!
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 bg-white/80 p-1.5 rounded-2xl border border-brand-border/40 shadow-xs">
            <button
              onClick={() => handleTabChange("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "orders"
                  ? "bg-brand-espresso text-brand-bg shadow-xs"
                  : "text-brand-muted hover:text-brand-espresso"
              }`}
            >
              <ShoppingBag size={13} />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => handleTabChange("wishlist")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${
                activeTab === "wishlist"
                  ? "bg-brand-espresso text-brand-bg shadow-xs"
                  : "text-brand-muted hover:text-brand-espresso"
              }`}
            >
              <Heart size={13} />
              <span>Favorites ({favoriteProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Orders List */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {loading ? (
              <div className="py-12 text-center text-xs text-brand-muted">
                Loading your order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-brand-fg/10 space-y-4">
                <ShoppingBag size={36} className="mx-auto text-brand-muted" />
                <h3 className="font-serif text-xl font-medium text-brand-espresso">
                  No Orders Found
                </h3>
                <p className="text-xs text-brand-muted">
                  You haven't placed any orders yet. Explore our luxury collection!
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-brand-espresso text-brand-bg rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-black transition"
                >
                  Explore Shop
                </Link>
              </div>
            ) : (
              orders.map((ord) => {
                const currentStep = getStepIndex(ord.status);

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-brand-fg/10 p-6 md:p-8 shadow-xs space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-fg/10 pb-4 gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">
                          Order ID
                        </span>
                        <h3 className="font-mono text-base font-bold text-brand-espresso">
                          #{ord.id}
                        </h3>
                        <span className="text-[11px] text-brand-muted">
                          Placed on {new Date(ord.date).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-brand-muted">
                          Total Amount
                        </span>
                        <p className="font-sans text-lg font-bold text-brand-espresso">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </p>
                        <span className="inline-block bg-amber-50 text-amber-900 border border-amber-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-1">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Status Stepper */}
                    <div className="bg-brand-bg/50 rounded-2xl p-4 border border-brand-border/40 space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-brand-espresso">
                        <span className="uppercase tracking-wider">Live Order Status</span>
                        <span className="text-amber-900 font-bold uppercase">{ord.status}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold uppercase tracking-wider">
                        {["Placed", "Packed", "Out for Delivery", "Delivered"].map((stepLabel, idx) => {
                          const isDone = idx <= currentStep;
                          return (
                            <div key={stepLabel} className="space-y-1">
                              <div
                                className={`h-1.5 rounded-full transition-colors ${
                                  isDone ? "bg-amber-800" : "bg-brand-border/60"
                                }`}
                              />
                              <span className={isDone ? "text-amber-900 font-bold" : "text-brand-muted"}>
                                {stepLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-brand-muted">
                        Items Purchased
                      </h4>
                      <div className="divide-y divide-brand-fg/5">
                        {ord.items?.map((item, i) => (
                          <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-12 object-cover rounded-lg border border-brand-border"
                                />
                              )}
                              <div>
                                <p className="font-semibold text-brand-espresso">{item.name}</p>
                                <p className="text-[10px] text-brand-muted">
                                  Size: {item.size} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-brand-espresso font-mono">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Favorites / Wishlist */}
        {activeTab === "wishlist" && (
          <div className="space-y-6">
            {favoriteProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-brand-fg/10 space-y-4">
                <Heart size={36} className="mx-auto text-brand-muted" />
                <h3 className="font-serif text-xl font-medium text-brand-espresso">
                  Your Favorites List is Empty
                </h3>
                <p className="text-xs text-brand-muted max-w-sm mx-auto">
                  Click the heart icon on any product in our store to add it to your personal favorites list!
                </p>
                <Link
                  to="/shop"
                  className="inline-block px-6 py-3 bg-brand-espresso text-brand-bg rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-black transition"
                >
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {favoriteProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
