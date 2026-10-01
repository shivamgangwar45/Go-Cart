'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StarIcon, Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '@/lib/features/wishlistSlice'
import toast from 'react-hot-toast'

const EMPTY_ITEMS = []

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // Type-safe matching taaki string vs number ID issue na aaye aur memory warning na ho
    const isWishlisted = useSelector((state) => {
        const items = state?.wishlist?.items ?? EMPTY_ITEMS
        return items.some((item) => String(item?.id) === String(product?.id))
    })

    // Safe average rating calculation
    const rating = useMemo(() => {
        if (!product?.rating || !Array.isArray(product.rating) || product.rating.length === 0) {
            return 0
        }
        const total = product.rating.reduce((acc, curr) => acc + (curr?.rating || 0), 0)
        return Math.round(total / product.rating.length)
    }, [product?.rating])

    // Update Recently Viewed in localStorage
    const handleProductClick = () => {
        if (typeof window === 'undefined' || !product?.id) return

        try {
            const raw = localStorage.getItem('gocart_recent')
            const existing = raw ? JSON.parse(raw) : []
            const filtered = existing.filter((p) => String(p?.id) !== String(product.id))
            const updated = [product, ...filtered].slice(0, 10)
            localStorage.setItem('gocart_recent', JSON.stringify(updated))
        } catch (err) {
            console.error('Failed to update recently viewed:', err)
        }
    }

    const handleWishlistClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (dispatch && toggleWishlist && product) {
            dispatch(toggleWishlist(product))
            if (isWishlisted) {
                toast.error('Removed from wishlist')
            } else {
                toast.success('Added to wishlist!')
            }
        }
    }

    const isOutOfStock = product?.inStock === false || product?.stock === 0
    const isLowStock = !isOutOfStock && product?.stock > 0 && product?.stock <= 5

    // Image source helper (supports both static imported objects and URL strings)
    const imageSrc = typeof product?.images?.[0] === 'object' && product?.images?.[0]?.src
        ? product.images[0].src
        : (product?.images?.[0] || '/placeholder.png')

    return (
        <div className="relative group max-xl:mx-auto max-w-[240px] w-full flex flex-col justify-between select-none">
            {/* Top Badges & Wishlist Heart */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                {isLowStock ? (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md animate-pulse">
                        Only {product.stock} left!
                    </span>
                ) : isOutOfStock ? (
                    <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                        Out of stock
                    </span>
                ) : (
                    <span />
                )}

                <button
                    type="button"
                    onClick={handleWishlistClick}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 ${
                        isWishlisted
                            ? 'bg-rose-500/25 text-rose-500 border border-rose-500/50 shadow-md shadow-rose-500/20'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                >
                    <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Product Card Body */}
            <Link className="block group/link" href={`/product/${product?.id}`} onClick={handleProductClick}>
                {/* Image Container */}
                <div className="relative bg-[#121a24] border border-slate-800/80 group-hover:border-emerald-500/40 h-44 sm:h-64 rounded-2xl flex items-center justify-center p-4 overflow-hidden transition-all duration-300 shadow-md">
                    <Image
                        src={imageSrc}
                        alt={product?.name || 'Product Image'}
                        width={500}
                        height={500}
                        sizes="(max-width: 640px) 176px, 256px"
                        priority={false}
                        className="max-h-32 sm:max-h-44 w-auto object-contain group-hover:scale-110 transition duration-300 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
                    />
                </div>

                {/* Details Section */}
                <div className="pt-3 px-1">
                    <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {product?.name || 'Untitled Product'}
                        </p>
                        <p className="text-sm font-bold text-white shrink-0">
                            {currency}{typeof product?.price === 'number' ? product.price.toFixed(2) : (product?.price ?? '0')}
                        </p>
                    </div>

                    {/* Star Rating & Category Info */}
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <StarIcon
                                    key={index}
                                    size={13}
                                    className="text-transparent"
                                    fill={rating >= index + 1 ? '#10b981' : '#334155'}
                                />
                            ))}
                            {product?.rating?.length > 0 && (
                                <span className="text-[10px] text-slate-400 ml-1">
                                    ({product.rating.length})
                                </span>
                            )}
                        </div>

                        {product?.category && (
                            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider truncate max-w-[80px]">
                                {product.category}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default React.memo(ProductCard)