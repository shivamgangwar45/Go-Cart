'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import toast from 'react-hot-toast'

const EMPTY_ARRAY = []

export default function FrequentlyBoughtTogether({ currentProduct }) {
  const dispatch = useDispatch()
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
  const allProducts = useSelector((state) => state?.product?.list ?? EMPTY_ARRAY)

  const [includeComplementary, setIncludeComplementary] = useState(true)

  // Smart Complementary Product Finder (same category ya complementary match)
  const complementaryProduct = useMemo(() => {
    if (!currentProduct || allProducts.length <= 1) return null
    return (
      allProducts.find(
        (p) => String(p.id) !== String(currentProduct.id) && p.category === currentProduct.category
      ) ||
      allProducts.find((p) => String(p.id) !== String(currentProduct.id)) ||
      null
    )
  }, [currentProduct, allProducts])

  if (!complementaryProduct) return null

  const mainPrice = Number(currentProduct.price) || 0
  const compPrice = Number(complementaryProduct.price) || 0
  const bundleTotal = includeComplementary ? mainPrice + compPrice : mainPrice
  const originalTotal = includeComplementary
    ? (Number(currentProduct.mrp) || mainPrice * 1.2) + (Number(complementaryProduct.mrp) || compPrice * 1.2)
    : Number(currentProduct.mrp) || mainPrice * 1.2
  const savings = Math.max(0, originalTotal - bundleTotal)

  const handleAddBundleToCart = () => {
    dispatch(addToCart({ productId: currentProduct.id }))
    if (includeComplementary) {
      dispatch(addToCart({ productId: complementaryProduct.id }))
      toast.success("Bundle items added to cart with combo savings!")
    } else {
      toast.success("Added to cart!")
    }
  }

  const getImageSrc = (prod) => {
    return typeof prod?.images?.[0] === 'object' && prod?.images?.[0]?.src
      ? prod.images[0].src
      : prod?.images?.[0] || '/placeholder.png'
  }

  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Sparkles size={15} />
        </div>
        <h3 className="text-sm font-bold text-white tracking-tight">Frequently Bought Together</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Product Visual Pair */}
        <div className="flex items-center gap-3">
          {/* Main Item */}
          <div className="relative size-20 sm:size-24 rounded-xl bg-[#0b0f17] border border-slate-800 p-2 flex items-center justify-center shrink-0">
            <Image
              src={getImageSrc(currentProduct)}
              alt={currentProduct.name}
              fill
              className="object-contain p-2"
            />
          </div>

          <div className="size-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-slate-700">
            <Plus size={14} />
          </div>

          {/* Complementary Item */}
          <div className={`relative size-20 sm:size-24 rounded-xl bg-[#0b0f17] border p-2 flex items-center justify-center shrink-0 transition-opacity ${includeComplementary ? 'border-emerald-500/50 opacity-100' : 'border-slate-800 opacity-40'}`}>
            <Image
              src={getImageSrc(complementaryProduct)}
              alt={complementaryProduct.name}
              fill
              className="object-contain p-2"
            />
          </div>
        </div>

        {/* Checkbox Details */}
        <div className="flex-1 space-y-2 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input type="checkbox" checked disabled className="accent-emerald-500 size-4 rounded" />
            <span className="font-semibold text-white">This item:</span>
            <span className="truncate max-w-[200px] text-slate-300">{currentProduct.name}</span>
            <span className="font-bold text-white ml-auto">{currency}{mainPrice}</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeComplementary}
              onChange={(e) => setIncludeComplementary(e.target.checked)}
              className="accent-emerald-500 size-4 rounded cursor-pointer"
            />
            <span className="font-semibold text-white">Combo add-on:</span>
            <span className="truncate max-w-[200px] text-slate-300">{complementaryProduct.name}</span>
            <span className="font-bold text-emerald-400 ml-auto">{currency}{compPrice}</span>
          </label>
        </div>

        {/* Pricing Summary & Button */}
        <div className="w-full lg:w-auto lg:border-l lg:border-slate-800 lg:pl-6 space-y-2 shrink-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">{currency}{bundleTotal.toFixed(2)}</span>
              {savings > 0 && (
                <span className="text-xs text-slate-500 line-through">{currency}{originalTotal.toFixed(2)}</span>
              )}
            </div>
            {savings > 0 && includeComplementary && (
              <span className="text-[11px] font-semibold text-emerald-400 block">
                Save {currency}{savings.toFixed(2)} on combo!
              </span>
            )}
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="w-full lg:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <ShoppingBag size={14} /> Add {includeComplementary ? 'Both' : 'Item'} to Cart
          </button>
        </div>
      </div>
    </div>
  )
}