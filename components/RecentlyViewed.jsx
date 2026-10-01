'use client'
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { History, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RecentlyViewed() {
  const [recentItems, setRecentItems] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('gocart_recent');
        if (stored) {
          setRecentItems(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error reading recently viewed items", e);
      }
    }
  }, []);

  if (!isClient) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 my-10 pt-8 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History size={20} className="text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Recently Viewed
          </h2>
        </div>
        {recentItems.length > 0 && (
          <button
            onClick={() => {
              localStorage.removeItem('gocart_recent');
              setRecentItems([]);
            }}
            className="text-xs text-slate-400 hover:text-rose-400 transition"
          >
            Clear History
          </button>
        )}
      </div>

      {recentItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {recentItems.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
          <EyeOff size={32} className="mx-auto text-slate-600" />
          <p className="text-sm font-medium text-slate-300">
            No recently viewed items yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our catalog and click on any product to see them appear here automatically!
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}