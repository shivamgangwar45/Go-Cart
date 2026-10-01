'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Search, LayoutGrid, List, Scale, Heart, 
  ShoppingCart, Star, RotateCcw, ChevronDown, Check, X 
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toggleWishlist } from '@/lib/features/wishlistSlice'
import toast from 'react-hot-toast'

const EMPTY_ITEMS = []

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured Picks' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'alpha', label: 'Alphabetical (A-Z)' },
]

const SUGGESTIONS = ['Headphones', 'Watch', 'Jacket', 'Sneakers', 'Chair', 'Desk']

export default function CatalogPage() {
  const dispatch = useDispatch()
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

  // Redux store integration with fallback demo products
  const reduxProducts = useSelector((state) => state?.product?.list ?? EMPTY_ITEMS)
  const wishlistItems = useSelector((state) => state?.wishlist?.items ?? EMPTY_ITEMS)

  const productsData = reduxProducts.length > 0 ? reduxProducts : [
    {
      id: 'cat_prod_1',
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Immersive sound experience with crystal clear acoustics and ultra-plush comfort earcups.',
      category: 'ELECTRONICS',
      price: 299.99,
      mrp: 384.00,
      discount: 22,
      rating: [{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }],
      ratingCount: 48,
      inStock: true,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600']
    },
    {
      id: 'cat_prod_2',
      name: 'Minimalist Modern Chair',
      description: 'A stylish and comfortable Scandinavian accent chair for modern dining or study rooms.',
      category: 'FURNITURE',
      price: 150.00,
      mrp: 192.00,
      discount: 22,
      rating: [{ rating: 4 }, { rating: 5 }, { rating: 5 }],
      ratingCount: 12,
      inStock: true,
      images: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600']
    },
    {
      id: 'cat_prod_3',
      name: 'Professional DSLR Camera',
      description: 'Capture high-speed stills and 4K cinema-grade footage with supreme low-light optical sensors.',
      category: 'ELECTRONICS',
      price: 1199.99,
      mrp: 1536.00,
      discount: 22,
      rating: [{ rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 5 }],
      ratingCount: 50,
      inStock: true,
      images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600']
    }
  ]

  // UI States
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [isSortModalOpen, setIsSortModalOpen] = useState(false)

  // Categories with counts calculation
  const categoriesWithCounts = useMemo(() => {
    const counts = { ALL: productsData.length }
    productsData.forEach((item) => {
      const cat = item.category?.toUpperCase() || 'GENERAL'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [productsData])

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let list = [...productsData]

    // 1. Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      list = list.filter((p) => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    // 2. Category Filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category?.toUpperCase() === selectedCategory)
    }

    // 3. In-Stock Filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock !== false && (p.stock === undefined || p.stock > 0))
    }

    // 4. Sort Options
    switch (selectedSort) {
      case 'price-asc':
        list.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-desc':
        list.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'rating':
        list.sort((a, b) => {
          const rA = a.rating?.length ? a.rating.reduce((s, x) => s + (x.rating || 0), 0) / a.rating.length : 0
          const rB = b.rating?.length ? b.rating.reduce((s, x) => s + (x.rating || 0), 0) / b.rating.length : 0
          return rB - rA
        })
        break
      case 'alpha':
        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      default:
        break
    }

    return list
  }, [productsData, searchTerm, selectedCategory, inStockOnly, selectedSort])

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('ALL')
    setSelectedSort('featured')
    setInStockOnly(false)
    toast.success('Filters cleared')
  }

  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ productId: product.id }))
    toast.success('Added to cart!')
  }

  const handleToggleWishlist = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(product))
    const exists = wishlistItems.some((it) => String(it.id) === String(product.id))
    if (exists) {
      toast.error('Removed from wishlist')
    } else {
      toast.success('Saved to wishlist!')
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ================= HEADER SECTION ================= */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            Explore our comprehensive inventory with real-time stock levels, high-definition galleries, and direct checkout.
          </p>
        </div>

        {/* View Toggle Bar (Showing X of Y & Grid/List) */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 text-xs font-semibold">
          <p className="text-slate-400">
            Showing <strong className="text-orange-500 font-bold">{filteredProducts.length}</strong> of {productsData.length} products
          </p>

          <div className="flex items-center gap-1 bg-[#12161f] border border-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List size={14} />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* ================= SEARCH & DISCOVERY BOX ================= */}
        <div className="bg-[#12161f] border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">🔍</span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Search Products by Name
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Filters the displayed products instantly in real-time as you type
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full bg-[#0b0f17] border border-slate-800 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-slate-600 text-xs rounded-2xl pl-11 pr-10 py-3.5 outline-none transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Suggested Quick Tags */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] text-slate-500 font-medium">Suggested names:</span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className={`text-[11px] font-semibold px-3.5 py-1.5 rounded-xl border transition active:scale-95 ${
                    searchTerm.toLowerCase() === tag.toLowerCase()
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CONTROLS: CATEGORIES & SORT BAR ================= */}
        <div className="bg-[#12161f] border border-slate-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          {/* Categories Pill Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-slate-500 font-semibold shrink-0 pr-1">Category:</span>
            {Object.entries(categoriesWithCounts).map(([catKey, count]) => {
              const isActive = selectedCategory === catKey
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-2xl transition-all shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-[#0b0f17] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{catKey === 'ALL' ? 'All' : catKey}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Sort & Stock Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/60">
            {/* Sort Picker Button (Opens Modal) */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Sort order:</span>
              <button
                onClick={() => setIsSortModalOpen(true)}
                className="flex items-center gap-3 bg-[#0b0f17] border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-white transition active:scale-95"
              >
                <span>{SORT_OPTIONS.find((s) => s.id === selectedSort)?.label}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
            </div>

            {/* In Stock & Reset */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-orange-500 size-4 rounded cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3.5 py-1.5 rounded-xl transition active:scale-95"
              >
                <RotateCcw size={12} />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT STREAM (GRID / LIST) ================= */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
            : "space-y-4"
          }>
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistItems.some((it) => String(it.id) === String(product.id))
              const imgUrl = typeof product.images?.[0] === 'object' ? product.images[0].src : product.images?.[0] || '/placeholder.png'

              return viewMode === 'grid' ? (
                /* ========= GRID CARD DESIGN (Exact match to screenshots) ========= */
                <div
                  key={product.id}
                  className="bg-[#12161f] border border-slate-800/80 hover:border-orange-500/40 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group"
                >
                  {/* Top Image Showcase */}
                  <div className="relative h-56 w-full bg-[#0b0f17] flex items-center justify-center p-4 overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                    />

                    {/* Compare & Wishlist Badges Top */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <button 
                        onClick={(e) => { e.preventDefault(); toast('Added to compare list', { icon: '⚖️' }); }}
                        className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-slate-700/60 text-slate-300 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition active:scale-95"
                      >
                        <Scale size={12} className="text-cyan-400" />
                        <span>Compare</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleWishlist(e, product)}
                        className={`size-8 rounded-full backdrop-blur-md flex items-center justify-center border transition active:scale-90 ${
                          isWishlisted
                            ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                            : 'bg-black/60 border-slate-700/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                        <span className="text-slate-500 text-[11px] font-normal">({product.ratingCount || 24})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>

                    {/* Price & Discount */}
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xl font-black text-orange-400">
                        {currency}{product.price}
                      </span>
                      {product.mrp && (
                        <span className="text-xs text-slate-500 line-through">
                          {currency}{product.mrp}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        22% OFF
                      </span>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
                      >
                        <ShoppingCart size={14} />
                        <span>Add to Cart</span>
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="px-4 py-3 bg-[#0b0f17] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-semibold transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* ========= LIST CARD DESIGN (Wide horizontal banner) ========= */
                <div
                  key={product.id}
                  className="bg-[#12161f] border border-slate-800/80 hover:border-orange-500/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 transition-all shadow-xl group"
                >
                  <div className="relative size-32 rounded-2xl bg-[#0b0f17] border border-slate-800 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    <Image src={imgUrl} alt={product.name} fill className="object-contain p-2" />
                  </div>

                  <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{product.description}</p>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-orange-400">{currency}{product.price}</span>
                      {product.mrp && <span className="text-xs text-slate-500 line-through">{currency}{product.mrp}</span>}
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        22% OFF
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="flex-1 sm:w-36 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold text-xs uppercase rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
                    >
                      <ShoppingCart size={13} />
                      <span>Add to Cart</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleToggleWishlist(e, product)}
                        className={`p-2.5 rounded-xl border transition ${
                          isWishlisted ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-[#0b0f17] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>
                      <Link
                        href={`/product/${product.id}`}
                        className="px-4 py-2 bg-[#0b0f17] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#12161f] border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
            <span className="text-3xl">📦</span>
            <h3 className="text-base font-bold text-white">No products matched</h3>
            <p className="text-xs text-slate-400">Try adjusting your search terms or clearing current filters.</p>
            <button
              onClick={handleResetFilters}
              className="mt-2 text-xs font-bold text-orange-400 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>

      {/* ================= SORT SELECTION MODAL (Exact match to screenshot 4) ================= */}
      {isSortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12161f] border border-slate-800 w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Sort Products By</h3>
              <button 
                onClick={() => setIsSortModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedSort(opt.id)
                    setIsSortModalOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition text-xs font-semibold ${
                    selectedSort === opt.id
                      ? 'bg-orange-500/15 border border-orange-500/40 text-orange-400'
                      : 'text-slate-300 hover:bg-[#0b0f17] hover:text-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <div className={`size-4 rounded-full border flex items-center justify-center ${
                    selectedSort === opt.id ? 'border-orange-500 bg-orange-500' : 'border-slate-600'
                  }`}>
                    {selectedSort === opt.id && <div className="size-1.5 rounded-full bg-slate-950" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}