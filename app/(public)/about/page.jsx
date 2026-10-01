import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, HeartHandshake, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us - GoCart',
  description: 'Learn more about GoCart',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 rounded-full">
            About GoCart
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Smart, Fast & Seamless Commerce
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            GoCart is a modern full-stack e-commerce platform built with Next.js, Prisma ORM, PostgreSQL, and Redux Toolkit to deliver high performance shopping and real-time order tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-2">
            <Zap className="text-emerald-400" size={24} />
            <h3 className="font-bold text-white text-base">Ultra Fast</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Server-rendered components and state synchronization for instant catalog browsing.</p>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-2">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h3 className="font-bold text-white text-base">Verified Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Encrypted password vaults and secure checkout supporting COD, Stripe, and Razorpay.</p>
          </div>
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-2">
            <HeartHandshake className="text-emerald-400" size={24} />
            <h3 className="font-bold text-white text-base">Customer First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Automated invoice generation, live order transit updates, and quick support.</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link href="/shop" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95">
            Explore Shop <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}