import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Package,
  Users,
  IndianRupee,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { products } from "@/data/products";
import { useAdminAuth } from "@/context/AdminAuthContext";
import CloudinaryImage from "../CloudinaryImage";

export default function AdminDashboardTab() {
  const { admin } = useAdminAuth();
  const [chartTimeframe, setChartTimeframe] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    month: string;
    label: string;
    x: number;
    y: number;
  } | null>(null);

  // Revenue chart data points (mapped to SVG coordinate system)
  // Width: 600, Height: 240
  // Y range: 0 (5K) to 200 (0K)
  const chartData = [
    { month: "Jan", val: 1400, label: "₹1,400", x: 40, y: 150 },
    { month: "Feb", val: 2100, label: "₹2,100", x: 140, y: 120 },
    { month: "Mar", val: 1600, label: "₹1,600", x: 240, y: 140 },
    { month: "Apr", val: 2900, label: "₹2,900", x: 340, y: 90 },
    { month: "May", val: 3500, label: "₹3,500", x: 440, y: 65 },
    { month: "Jun", val: 4276, label: "₹4,276", x: 540, y: 35 },
  ];

  // SVG Smooth Bezier Path calculation
  const pathD = `M 40,150 C 90,135 90,120 140,120 C 190,120 190,140 240,140 C 290,140 290,90 340,90 C 390,90 390,65 440,65 C 490,65 490,35 540,35`;
  const areaD = `${pathD} L 540,210 L 40,210 Z`;

  const recentOrders = [
    {
      id: "#1534E8",
      date: "1 Jun 2025",
      title: "Timeless Sparks Studs",
      status: "Pending",
      price: "₹319",
      img: products[0]?.images[0] || "https://images.unsplash.com/photo-1614786269829-d24616faf56d?w=100&q=80",
    },
    {
      id: "#1532E1",
      date: "31 May 2025",
      title: "Twin Heart Studs (pink)",
      status: "Pending",
      price: "₹269",
      img: products[1]?.images[0] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&q=80",
    },
    {
      id: "#7A3456",
      date: "31 May 2025",
      title: "Timeless Spark Studs",
      status: "Pending",
      price: "₹319",
      img: products[2]?.images[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80",
    },
    {
      id: "#1532DD",
      date: "30 May 2025",
      title: "Twin Heart Studs (pink)",
      status: "Cancelled",
      price: "₹269",
      img: products[3]?.images[0] || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=100&q=80",
    },
  ];

  const lowStockItems = [
    {
      id: "ls-1",
      title: "Timeless Spark Studs",
      stock: 0,
      img: products[0]?.images[0],
    },
    {
      id: "ls-2",
      title: "Mini Twinkle Studs",
      stock: 1,
      img: products[1]?.images[0],
    },
    {
      id: "ls-3",
      title: "Open Heart Studs",
      stock: 1,
      img: products[2]?.images[0],
    },
    {
      id: "ls-4",
      title: "Sweetheart Spark Studs",
      stock: 0,
      img: products[3]?.images[0],
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Greeting Header */}
      <div>
        <p className="font-sans text-xs tracking-wider text-brand-muted uppercase font-medium">
          Wednesday, 1 July
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-brand-espresso font-normal mt-1">
          Good morning, {admin?.name ? admin.name.split(" ")[0] : "Admin"}.
        </h1>
        <p className="font-sans text-xs text-brand-muted mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-brand-border/30 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE6] flex items-center justify-center text-brand-espresso">
              <IndianRupee className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <p className="font-sans text-[11px] font-bold tracking-widest text-brand-muted uppercase">
                Total Revenue
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-espresso mt-0.5">
                ₹4,276
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>12.8% vs last 30 days</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-brand-border/30 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE6] flex items-center justify-center text-brand-espresso">
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <p className="font-sans text-[11px] font-bold tracking-widest text-brand-muted uppercase">
                Total Orders
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-espresso mt-0.5">
                19
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2 new orders</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-brand-border/30 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE6] flex items-center justify-center text-brand-espresso">
              <Package className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <p className="font-sans text-[11px] font-bold tracking-widest text-brand-muted uppercase">
                Total Products
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-espresso mt-0.5">
                39
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-amber-700">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>5 low in stock</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-brand-border/30 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F5EFE6] flex items-center justify-center text-brand-espresso">
              <Users className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <p className="font-sans text-[11px] font-bold tracking-widest text-brand-muted uppercase">
                Total Customers
              </p>
              <h3 className="font-serif text-2xl md:text-3xl text-brand-espresso mt-0.5">
                8,642
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>6.2% vs last 30 days</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Revenue Overview & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Overview Line Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-brand-border/30 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border/20">
              <div>
                <h3 className="font-serif text-xl text-brand-espresso font-normal">
                  Revenue Overview
                </h3>
                <p className="font-sans text-xs text-brand-muted mt-0.5">
                  Gross revenue across all channels
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-serif text-xl text-brand-espresso font-medium">
                  ₹4,276
                </span>
                
                <div className="relative">
                  <button
                    onClick={() =>
                      setChartTimeframe((prev) =>
                        prev === "Monthly" ? "Weekly" : prev === "Weekly" ? "Yearly" : "Monthly"
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border/40 text-xs font-medium text-brand-espresso hover:bg-brand-bg transition-colors"
                  >
                    {chartTimeframe}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative mt-8 pt-4 pb-2 w-full overflow-x-auto no-scrollbar">
              <div className="min-w-[550px]">
                <svg viewBox="0 0 600 240" className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5C1D24" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#5C1D24" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Y-Axis Grid Lines */}
                  {[
                    { label: "₹5K", y: 20 },
                    { label: "₹4K", y: 55 },
                    { label: "₹3K", y: 90 },
                    { label: "₹2K", y: 125 },
                    { label: "₹1K", y: 160 },
                    { label: "₹0", y: 200 },
                  ].map((grid, idx) => (
                    <g key={idx}>
                      <text
                        x="0"
                        y={grid.y + 4}
                        fill="#A99C8D"
                        fontSize="11"
                        fontFamily="sans-serif"
                      >
                        {grid.label}
                      </text>
                      <line
                        x1="35"
                        y1={grid.y}
                        x2="580"
                        y2={grid.y}
                        stroke="#EFE9DF"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    </g>
                  ))}

                  {/* Area Fill */}
                  <path d={areaD} fill="url(#revenueGradient)" />

                  {/* Line Path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#5C1D24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data Points & Interactive Hovers */}
                  {chartData.map((pt, idx) => (
                    <g key={idx} className="cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#5C1D24"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        className="transition-transform duration-200 hover:scale-150"
                        onMouseEnter={() => setHoveredDataPoint(pt)}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      />
                      {/* X-Axis Month Labels */}
                      <text
                        x={pt.x}
                        y="225"
                        textAnchor="middle"
                        fill="#161412"
                        fontSize="12"
                        fontFamily="sans-serif"
                        className="font-medium"
                      >
                        {pt.month}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Tooltip */}
                {hoveredDataPoint && (
                  <div
                    className="absolute bg-brand-espresso text-brand-bg text-xs px-3 py-1.5 rounded-md shadow-lg pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-2 font-sans"
                    style={{
                      left: `${(hoveredDataPoint.x / 600) * 100}%`,
                      top: `${(hoveredDataPoint.y / 240) * 100}%`,
                    }}
                  >
                    <span className="font-semibold">{hoveredDataPoint.month}:</span> {hoveredDataPoint.label}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-border/20 mt-6">
            <button className="flex items-center justify-center gap-2 bg-[#5C1D24] text-white px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold hover:bg-[#4A151B] transition-colors group shadow-sm">
              <span>View full report</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right Column: Recent Orders & Low Stock */}
        <div className="space-y-8">
          
          {/* Recent Orders Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-brand-border/30 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-brand-espresso">Recent Orders</h3>
              <button className="text-xs font-medium text-brand-muted hover:text-brand-fg flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-2.5 hover:bg-brand-bg/60 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CloudinaryImage
                      src={order.img}
                      alt={order.title}
                      width={100}
                      className="w-10 h-10 rounded-lg object-cover bg-brand-surface border border-brand-border/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-brand-espresso">
                          {order.id}
                        </span>
                        <span className="text-[10px] text-brand-muted">{order.date}</span>
                      </div>
                      <p className="text-xs font-medium text-brand-espresso line-clamp-1 mt-0.5">
                        {order.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <span
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                        order.status === "Pending"
                          ? "bg-[#F7EFE2] text-[#A66E28]"
                          : order.status === "Cancelled"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-mono text-xs font-bold text-brand-espresso">
                      {order.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-brand-border/30 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-brand-espresso">Low Stock Alert</h3>
              <button className="text-xs font-medium text-brand-muted hover:text-brand-fg flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 hover:bg-brand-bg/60 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CloudinaryImage
                      src={item.img || "https://images.unsplash.com/photo-1614786269829-d24616faf56d?auto=format&fit=crop&w=800&q=80"}
                      alt={item.title}
                      width={100}
                      className="w-9 h-9 rounded-lg object-cover bg-brand-surface border border-brand-border/30"
                    />
                    <span className="text-xs font-medium text-brand-espresso">
                      {item.title}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold ${
                      item.stock === 0 ? "text-rose-600" : "text-amber-600"
                    }`}
                  >
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
