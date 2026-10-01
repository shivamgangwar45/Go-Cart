'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  Package, CheckCircle2, AlertTriangle, LogOut, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

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

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
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
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#0b0f17] border border-slate-800 px-4 py-2 rounded-xl transition"
            >
              <ArrowLeft size={14} /> View Store
            </Link>

            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl transition active:scale-95"
            >
              <LogOut size={14} /> Exit Admin
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Revenue</span>
              <DollarSign size={18} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{currency}24,580</p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp size={12} /> +14.2% from last month
            </span>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
              <ShoppingBag size={18} className="text-indigo-400" />
            </div>
            <p className="text-2xl font-bold text-white">438</p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={12} /> 94% fulfillment rate
            </span>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Total Customers</span>
              <Users size={18} className="text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">1,204</p>
            <span className="text-[11px] text-slate-400">Verified accounts</span>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Low Stock Items</span>
              <AlertTriangle size={18} className="text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300">3</p>
            <span className="text-[11px] text-amber-400/80">Needs replenishment</span>
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Package size={18} className="text-emerald-400" /> Recent Transactions
            </h2>
            <span className="text-xs text-slate-400">Live order stream</span>
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
                <tr>
                  <td className="py-3 font-mono font-bold text-white">#ORD-90214</td>
                  <td className="py-3">Shivam Gangwar</td>
                  <td className="py-3 font-bold text-white">{currency}800.00</td>
                  <td className="py-3"><span className="text-emerald-400 font-semibold">Razorpay</span></td>
                  <td className="py-3"><span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px]">Processing</span></td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-bold text-white">#ORD-90213</td>
                  <td className="py-3">Aman Verma</td>
                  <td className="py-3 font-bold text-white">{currency}1,250.00</td>
                  <td className="py-3"><span className="text-amber-400 font-semibold">COD</span></td>
                  <td className="py-3"><span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px]">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}