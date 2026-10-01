'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  Package, CheckCircle2, AlertTriangle, LogOut, ArrowLeft, RefreshCw, PlusCircle, StoreIcon
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import OrdersAreaChart from '@/components/OrdersAreaChart';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [analytics, setAnalytics] = useState({
    stats: {
      totalProducts: 0,
      totalRevenue: 0,
      totalOrders: 0,
      totalStores: 0,
      totalCustomers: 0,
      lowStockCount: 0,
      fulfillmentRate: 100,
    },
    allOrders: [],
    recentOrders: [],
  });

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  // 1. Auth Guard
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user || user.role !== 'admin' || user.email !== 'admin@gocart.com') {
        router.replace('/login');
      } else {
        setAuthorized(true);
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  // 2. Real Analytics Fetcher
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setAnalytics({
          stats: {
            totalProducts: data.stats?.totalProducts ?? data.products ?? 0,
            totalRevenue: data.stats?.totalRevenue ?? data.revenue ?? 0,
            totalOrders: data.stats?.totalOrders ?? data.orders ?? 0,
            totalStores: data.stats?.totalStores ?? data.stores ?? 0,
            totalCustomers: data.stats?.totalCustomers ?? data.users ?? 0,
            lowStockCount: data.stats?.lowStockCount ?? 0,
            fulfillmentRate: data.stats?.fulfillmentRate ?? 100,
          },
          allOrders: data.allOrders ?? [],
          recentOrders: data.recentOrders ?? data.allOrders?.slice(0, 8) ?? [],
        });
      }
    } catch (err) {
      console.error("Failed to load real dashboard metrics:", err);
      toast.error("Dashboard analytics load nahi ho paya");
    } finally {
      setLoading(false);
    }
  };

  // 3. Real Test Order & Store Creator
  const handleCreateRealTestOrder = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/admin/create-test-order', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || 'Neon DB me orders successfully create ho gaye!');
        await fetchAnalytics();
      } else {
        toast.error(data.message || 'Order creation fail ho gaya');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Test order create nahi ho paya');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      fetchAnalytics();
    }
  }, [authorized]);

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push('/login');
    router.refresh();
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center text-slate-400 text-xs">
        Checking Admin Permissions...
      </div>
    );
  }

  const { stats, allOrders, recentOrders } = analytics;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-6 rounded-3xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">GoCart Admin</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Root Access
              </span>
            </div>
            <p className="text-xs text-slate-400">admin@gocart.com</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateRealTestOrder}
              disabled={generating}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
            >
              <PlusCircle size={14} /> {generating ? 'Writing to DB...' : 'Generate Real DB Orders'}
            </button>

            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#0b0f17] border border-slate-800 px-3.5 py-2 rounded-xl transition active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#0b0f17] border border-slate-800 px-4 py-2 rounded-xl transition"
            >
              <ArrowLeft size={14} /> View Store
            </Link>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl transition active:scale-95 cursor-pointer"
            >
              <LogOut size={14} /> Exit Admin
            </button>
          </div>
        </div>

        {/* 4 Cards Grid - Matches GoCart Admin Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Products */}
          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Products</span>
              <ShoppingBag size={18} className="text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : stats.totalProducts}
            </p>
            <span className="text-[11px] text-slate-400">Live in catalog</span>
          </div>

          {/* Total Revenue */}
          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Revenue</span>
              <DollarSign size={18} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : `${currency}${Number(stats.totalRevenue || 0).toLocaleString()}`}
            </p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp size={12} /> Neon DB Synced
            </span>
          </div>

          {/* Total Orders */}
          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
              <Package size={18} className="text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : stats.totalOrders}
            </p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> {stats.fulfillmentRate}% fulfillment rate
            </span>
          </div>

          {/* Total Stores */}
          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Stores</span>
              <StoreIcon size={18} className="text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {loading ? "..." : stats.totalStores}
            </p>
            <span className="text-[11px] text-amber-400/80">Active vendors</span>
          </div>
        </div>

        {/* Orders / Day Chart */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> Orders Overview
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Orders <span className="text-slate-600">/ Day</span>
            </span>
          </div>

          {allOrders && allOrders.length > 0 ? (
            <OrdersAreaChart allOrders={allOrders} />
          ) : (
            <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
              <p className="text-xs text-slate-500">Database me abhi 0 orders hain.</p>
              <button
                onClick={handleCreateRealTestOrder}
                disabled={generating}
                className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-lg hover:bg-emerald-500/20 transition cursor-pointer"
              >
                Click here to insert test orders into Neon DB
              </button>
            </div>
          )}
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package size={18} className="text-emerald-400" /> Recent Transactions
            </h2>
            <span className="text-xs text-slate-400">Live order stream from Neon DB</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <tr>
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Payment</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      Loading latest transactions...
                    </td>
                  </tr>
                ) : recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 font-mono font-bold text-white">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 text-slate-300">
                        {order.user?.name || order.address?.name || "Customer"}
                      </td>
                      <td className="py-3 font-bold text-white">
                        {currency}{Number(order.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`font-semibold ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {order.paymentMethod || (order.isPaid ? 'PAID' : 'COD')}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No orders placed yet in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}