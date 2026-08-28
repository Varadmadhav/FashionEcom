import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ShieldCheck,
  LogOut,
  Search,
  Calendar,
  ChevronDown,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminLoginModal from "@/components/admin/AdminLoginModal";
import AdminDashboardTab from "@/components/admin/AdminDashboardTab";
import {
  ProductsTabView,
  OrdersTabView,
  CustomersTabView,
  AdminsTabView,
} from "@/components/admin/AdminTabViews";

type AdminTab = "dashboard" | "products" | "orders" | "customers" | "admins";

export default function AdminPage() {
  const { admin, isAuthenticated, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated || !admin) {
    return <AdminLoginModal />;
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "admins", label: "Admins", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex text-brand-fg font-sans select-none">
      
      {/* ---------------------------------------------------- */}
      {/* SIDEBAR (Desktop Fixed & Mobile Drawer) */}
      {/* ---------------------------------------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#F5EFE6] border-r border-brand-border/40 flex flex-col justify-between p-6 transition-transform duration-300 md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link to="/" className="block">
              <h1 className="font-serif text-2xl tracking-[0.25em] text-brand-espresso font-normal">
                AURELIE
              </h1>
              <p className="font-sans text-[9px] font-bold tracking-[0.3em] text-brand-muted uppercase mt-0.5">
                Admin Panel
              </p>
            </Link>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-brand-muted hover:text-brand-espresso"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-sans text-xs transition-all duration-200 ${
                    isActive
                      ? "bg-[#EAE2D5] text-brand-espresso font-semibold shadow-xs"
                      : "text-brand-muted hover:bg-[#EAE2D5]/50 hover:text-brand-espresso font-medium"
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? "text-brand-espresso" : "text-brand-muted"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Store Return & Sign Out */}
        <div className="space-y-3 pt-6 border-t border-brand-border/30">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-xs text-brand-muted hover:text-brand-espresso hover:bg-[#EAE2D5]/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-xs text-brand-muted hover:text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 stroke-[1.8]" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 border-b border-brand-border/30 px-6 md:px-10 flex items-center justify-between bg-[#F7F4EE]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden text-brand-muted hover:text-brand-espresso p-1.5"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl text-brand-espresso capitalize">
              {activeTab}
            </h2>
          </div>

          {/* Search bar & Admin profile avatar */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Input */}
            <div className="relative hidden sm:block w-48 md:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-[#EFE9DF]/80 pl-9 pr-4 py-2 rounded-xl text-xs border border-brand-border/40 focus:outline-none focus:border-brand-espresso transition-colors text-brand-fg placeholder:text-brand-muted"
              />
            </div>

            {/* Date Selector Filter */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-border/40 bg-[#EFE9DF]/50 text-xs font-medium text-brand-espresso">
              <Calendar className="w-3.5 h-3.5 text-brand-muted" />
              <span>Last 30 days</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted" />
            </div>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-3 pl-2 border-l border-brand-border/30">
              <div className="w-9 h-9 rounded-full bg-[#EAE2D5] border border-brand-border/60 flex items-center justify-center font-serif text-xs font-bold text-brand-espresso">
                {admin.avatar || "AK"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-brand-espresso leading-tight">
                  {admin.name}
                </p>
                <p className="text-[10px] text-brand-muted capitalize">
                  {admin.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Main Tab Content */}
        <main className="p-6 md:p-10 flex-1 overflow-y-auto">
          {activeTab === "dashboard" && <AdminDashboardTab />}
          {activeTab === "products" && <ProductsTabView />}
          {activeTab === "orders" && <OrdersTabView />}
          {activeTab === "customers" && <CustomersTabView />}
          {activeTab === "admins" && <AdminsTabView />}
        </main>

      </div>

    </div>
  );
}
