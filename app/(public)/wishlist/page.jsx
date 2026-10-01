'use client'
import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const EMPTY_ITEMS = [];

export default function WishlistPage() {
  const wishlistItems = useSelector((state) => state?.wishlist?.items ?? EMPTY_ITEMS);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={24} />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                My Wishlist
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition w-fit"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Content */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-[#111827] border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Heart size={30} />
            </div>
            <h2 className="text-lg font-bold text-white">Your wishlist is empty</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore products in the store and tap the heart icon on any product to save your favorites here.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <ShoppingBag size={16} /> Explore Products
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}