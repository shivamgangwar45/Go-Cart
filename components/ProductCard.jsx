'use client'
import { StarIcon, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleWishlist } from '@/lib/features/wishlistSlice'

// Stable constant reference: Redux selector warning ko rokne ke liye
const EMPTY_ITEMS = []

const ProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    // Fix: Redux selector warning solved by using a stable fallback reference
    const isWishlisted = useSelector((state) => {
        const items = state?.wishlist?.items ?? EMPTY_ITEMS
        return items.some((item) => item?.id === product?.id)
    })

    // Calculate the average rating safely
    const rating = product?.rating && Array.isArray(product.rating) && product.rating.length > 0
        ? Math.round(product.rating.reduce((acc, curr) => acc + (curr?.rating || 0), 0) / product.rating.length)
        : 0

    // Add to Recently Viewed Products in localStorage on click
    const handleProductClick = () => {
        if (typeof window !== 'undefined' && product?.id) {
            try {
                const existing = JSON.parse(localStorage.getItem('gocart_recent') || '[]')
                const filtered = existing.filter((p) => p?.id !== product.id)
                const updated = [product, ...filtered].slice(0, 10)
                localStorage.setItem('gocart_recent', JSON.stringify(updated))
            } catch (err) {
                console.error("Failed to update recently viewed:", err)
            }
        }
    }

    const handleWishlistClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (dispatch && toggleWishlist) {
            dispatch(toggleWishlist(product))
        }
    }

    return (
        <div className='relative group max-xl:mx-auto max-w-[240px] w-full flex flex-col justify-between'>
            
            {/* Top Badges (Stock Alert & Wishlist Button) */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between pointer-events-none">
                {product?.stock > 0 && product?.stock <= 5 ? (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md animate-pulse">
                        Only {product.stock} left!
                    </span>
                ) : product?.inStock === false || product?.stock === 0 ? (
                    <span className="bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                        Out of stock
                    </span>
                ) : <span />}

                {/* Wishlist Heart Button */}
                <button
                    type="button"
                    onClick={handleWishlistClick}
                    className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
                        isWishlisted
                            ? 'bg-rose-500/25 text-rose-500 border border-rose-500/50 shadow-md shadow-rose-500/20'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-700/60'
                    }`}
                    title="Wishlist"
                >
                    <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
            </div>

            {/* Product Card Body & Link */}
            <Link 
                href={`/product/${product?.id}`} 
                onClick={handleProductClick}
                className='block'
            >
                {/* Image Container with Dark Theme & Hover Zoom */}
                <div className='bg-[#121a24] border border-slate-800/80 group-hover:border-emerald-500/40 h-44 sm:h-64 rounded-2xl flex items-center justify-center p-4 overflow-hidden transition-all duration-300 shadow-md'>
                    <Image 
                        width={500} 
                        height={500} 
                        className='max-h-32 sm:max-h-44 w-auto object-contain group-hover:scale-110 transition duration-300 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]' 
                        src={product?.images?.[0] || '/placeholder.png'} 
                        alt={product?.name || 'product_img'} 
                    />
                </div>

                {/* Details Section */}
                <div className='pt-3 px-1'>
                    <div className='flex justify-between items-start gap-2'>
                        <p className='text-sm font-medium text-slate-200 group-hover:text-emerald-400 transition-colors line-clamp-1'>
                            {product?.name}
                        </p>
                        <p className='text-sm font-bold text-white shrink-0'>
                            {currency}{product?.price}
                        </p>
                    </div>

                    {/* Star Rating & Category Info */}
                    <div className='flex items-center justify-between mt-1'>
                        <div className='flex items-center gap-0.5'>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon 
                                    key={index} 
                                    size={13} 
                                    className='text-transparent' 
                                    fill={rating >= index + 1 ? "#10b981" : "#334155"} 
                                />
                            ))}
                            {product?.rating?.length > 0 && (
                                <span className='text-[10px] text-slate-400 ml-1'>
                                    ({product.rating.length})
                                </span>
                            )}
                        </div>
                        {product?.category && (
                            <span className='text-[10px] uppercase font-semibold text-slate-500 tracking-wider'>
                                {product.category}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ProductCard