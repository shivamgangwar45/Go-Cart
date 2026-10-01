'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, Star, ShoppingCart, Check, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlistSlice'
import toast from 'react-hot-toast'

const EMPTY_ITEMS = []

export default function QuickViewModal({ product, isOpen, onClose }) {
  const dispatch = useDispatch()
  const [selectedImgIdx, setSelectedImgIdx] = useState(0)
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

  const isWishlisted = useSelector((state) => {
    const items = state?.wishlist?.items ?? EMPTY_ITEMS
    return items.some((item) => String(item?.id) === String(product?.id))
  })

  if (!isOpen || !product) return null

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['/placeholder.png']

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id }))
    toast.success("Added to cart!")
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist(product))
    if (isWishlisted) {
      toast.error("Removed from wishlist")
    } else {
      toast.success("Added to wishlist!")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-6 sm:gap-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition z-10"
        >
          <X size={18} />
        </button>

        {/* Product Visual Showcase */}
        <div className="md:w-1/2 space-y-3">
          <div className="relative bg-[#0b0f17] border border-slate-800/80 rounded-2xl h-56 sm:h-72 flex items-center justify-center p-4 overflow-hidden">
            <Image
              src={typeof images[selectedImgIdx] === 'object' ? images[selectedImgIdx].src : images[selectedImgIdx]}
              alt={product.name || 'Product'}
              fill
              className="object-contain p-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImgIdx(i)}
                  className={`size-14 relative rounded-xl bg-[#0b0f17] border overflow-hidden shrink-0 transition ${
                    selectedImgIdx === i ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-800'
                  }`}
                >
                  <Image src={typeof img === 'object' ? img.src : img} alt="Thumb" fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="md:w-1/2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {product.category || 'Store Item'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex text-emerald-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="fill-emerald-400 text-transparent" />
                ))}
              </div>
              <span className="text-slate-400 text-[11px] font-semibold">
                ({product.rating?.length || 4} verified reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-2xl font-black text-white">{currency}{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-slate-500 line-through">{currency}{product.mrp}</span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 pt-1">
              {product.description || 'Premium build quality engineered for durability, performance, and everyday convenience.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <ShoppingCart size={15} /> Add to Cart
              </button>
              
              <button
                onClick={handleWishlist}
                className={`p-3 rounded-xl border transition ${
                  isWishlisted 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
              <Check size={12} className="text-emerald-400" /> Free express delivery & 7-day returns
            </span>
          </div>

        </div>

      </div>
    </div>
  )
}