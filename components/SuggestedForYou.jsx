'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, Star, ShoppingCart, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const EMPTY_ARRAY = []

// Fallback high-conversion products agar Redux store abhi fetch na hua ho
const FALLBACK_SUGGESTIONS = [
  {
    id: 'sugg_1',
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'ELECTRONICS',
    price: 299.99,
    mrp: 384.00,
    rating: [{ rating: 5 }, { rating: 5 }, { rating: 4 }],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600']
  },
  {
    id: 'sugg_2',
    name: 'Minimalist Modern Chair',
    category: 'FURNITURE',
    price: 150.00,
    mrp: 192.00,
    rating: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
    images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600']
  },
  {
    id: 'sugg_3',
    name: 'Professional DSLR Camera',
    category: 'ELECTRONICS',
    price: 1199.99,
    mrp: 1536.00,
    rating: [{ rating: 5 }, { rating: 5 }, { rating: 5 }],
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600']
  },
  {
    id: 'sugg_4',
    name: 'Vintage Brass Desk Lamp',
    category: 'LIGHTING',
    price: 89.99,
    mrp: 120.00,
    rating: [{ rating: 5 }, { rating: 5 }],
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600']
  }
]

export default function SuggestedForYou({ excludeId = null, title = "Suggested For You" }) {
  const dispatch = useDispatch()
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

  const allProducts = useSelector((state) => state?.product?.list ?? EMPTY_ARRAY)
  const cartItems = useSelector((state) => state?.cart?.cartItems ?? {})

  const suggestions = useMemo(() => {
    // 1. Agar Redux mein products available hain
    if (allProducts && allProducts.length > 0) {
      const inCartIds = new Set(Object.keys(cartItems).map(String))
      let candidates = allProducts.filter(
        (p) => String(p.id) !== String(excludeId) && !inCartIds.has(String(p.id))
      )

      if (candidates.length < 4) {
        candidates = allProducts.filter((p) => String(p.id) !== String(excludeId))
      }

      if (candidates.length > 0) {
        return candidates.slice(0, 4)
      }
    }

    // 2. Guaranteed Fallback
    return FALLBACK_SUGGESTIONS.filter((p) => String(p.id) !== String(excludeId)).slice(0, 4)
  }, [allProducts, cartItems, excludeId])

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ productId: product.id }))
    toast.success(`${product.name.slice(0, 22)}... added to cart!`)
  }

  const getImageSrc = (prod) => {
    if (typeof prod?.images?.[0] === 'object' && prod?.images?.[0]?.src) {
      return prod.images[0].src
    }
    return prod?.images?.[0] || '/placeholder.png'
  }

  return (
    <section className="bg-[#111827] border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Sparkles size={17} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              {title}
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                AI Curated
              </span>
            </h2>
            <p className="text-xs text-slate-400">Handpicked recommendations tailored to your taste</p>
          </div>
        </div>

        <Link
          href="/catalog"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 group"
        >
          <span>View All</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {suggestions.map((item) => {
          const ratingVal =
            Array.isArray(item.rating) && item.rating.length > 0
              ? (item.rating.reduce((s, r) => s + (r.rating || 0), 0) / item.rating.length).toFixed(1)
              : '4.9'

          return (
            <div
              key={item.id}
              className="bg-[#0b0f17] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between group transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
            >
              <Link href={`/product/${item.id}`} className="space-y-3 block">
                {/* Product Thumbnail */}
                <div className="relative h-40 w-full bg-[#12161f] border border-slate-800/60 rounded-xl flex items-center justify-center p-3 overflow-hidden">
                  <Image
                    src={getImageSrc(item)}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                  />
                  {item.category && (
                    <span className="absolute top-2.5 left-2.5 text-[9px] uppercase font-bold tracking-wider text-slate-300 bg-black/60 backdrop-blur-md border border-slate-800 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{ratingVal}</span>
                    <span className="text-slate-600 text-[10px]">({item.rating?.length || 24})</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </div>
              </Link>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-sm font-black text-white">
                    {currency}{item.price}
                  </span>
                  {item.mrp && item.mrp > item.price && (
                    <span className="text-[10px] text-slate-500 line-through ml-1.5 font-medium">
                      {currency}{item.mrp}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, item)}
                  className="p-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 rounded-xl transition shadow-md shadow-emerald-500/20 cursor-pointer"
                  title="Add to Cart"
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}