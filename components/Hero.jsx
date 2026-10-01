'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoriesMarquee from './CategoriesMarquee'

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    return (
        <div className='mx-4 sm:mx-6'>
            <div className='flex max-xl:flex-col gap-6 max-w-7xl mx-auto my-8'>
                
                {/* Main Featured Hero Card */}
                <div className='relative flex-1 flex flex-col justify-between rounded-3xl xl:min-h-[460px] bg-gradient-to-br from-[#121c27] via-[#0f1722] to-[#090e17] border border-slate-800/90 shadow-2xl overflow-hidden group'>
                    
                    {/* Ambient Radial Lighting Glow */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className='p-6 sm:p-12 z-10 max-w-xl'>
                        {/* News / Offer Badge */}
                        <div className='inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 pr-4 p-1 rounded-full text-xs font-medium backdrop-blur-md shadow-sm'>
                            <span className='bg-emerald-500 px-2.5 py-0.5 rounded-full text-slate-950 font-bold text-[10px] tracking-wide'>
                                NEWS
                            </span>
                            <span>Free Express Shipping on Orders Above {currency}50!</span>
                            <ChevronRightIcon className='group-hover:translate-x-1 transition-transform text-emerald-400' size={15} />
                        </div>

                        {/* Hero Headline */}
                        <h2 className='text-3xl sm:text-5xl leading-[1.18] my-4 font-extrabold text-white tracking-tight'>
                            Gadgets you'll love.{' '}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400'>
                                Prices you'll trust.
                            </span>
                        </h2>

                        {/* Starting Price */}
                        <div className='text-slate-300 text-xs uppercase tracking-wider font-semibold mt-4 sm:mt-6'>
                            <p className="text-slate-400 text-xs">Starts from</p>
                            <p className='text-3xl font-black text-white mt-0.5 tracking-tight'>
                                {currency}4.90
                            </p>
                        </div>

                        {/* Primary Call to Action */}
                        <Link 
                            href='/shop' 
                            className='inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 px-8 sm:px-10 mt-6 sm:mt-8 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all duration-200'
                        >
                            LEARN MORE
                            <ArrowRightIcon size={16} />
                        </Link>
                    </div>

                    {/* Model Image with Soft Dark Lighting */}
                    <div className='sm:absolute bottom-0 right-0 md:right-6 w-full sm:max-w-sm flex items-end justify-center sm:justify-end pointer-events-none'>
                        <Image 
                            className='w-auto h-auto max-h-[380px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter brightness-95 contrast-105' 
                            src={assets.hero_model_img} 
                            alt="hero_model" 
                            priority 
                        />
                    </div>
                </div>

                {/* Right Side Bento Grid Cards */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm'>
                    
                    {/* Bento 1: Best Products */}
                    <Link 
                        href='/shop?filter=best' 
                        className='flex-1 flex items-center justify-between w-full rounded-3xl p-6 px-7 bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-[#0e141f] border border-amber-500/20 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 group cursor-pointer transition-all duration-300 relative overflow-hidden'
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="z-10">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">
                                Top Rated
                            </span>
                            <p className='text-2xl sm:text-3xl font-bold text-white leading-tight'>
                                Best<br />products
                            </p>
                            <p className='flex items-center gap-1.5 text-xs font-semibold text-amber-300/90 mt-5 group-hover:text-amber-300 transition-colors'>
                                View more 
                                <ArrowRightIcon className='group-hover:translate-x-1.5 transition-transform' size={15} /> 
                            </p>
                        </div>
                        <div className="w-28 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image 
                                className='w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]' 
                                src={assets.hero_product_img1} 
                                alt="best_products" 
                            />
                        </div>
                    </Link>

                    {/* Bento 2: 20% Discounts */}
                    <Link 
                        href='/shop?filter=discount' 
                        className='flex-1 flex items-center justify-between w-full rounded-3xl p-6 px-7 bg-gradient-to-br from-blue-950/20 via-slate-900/80 to-[#0e141f] border border-blue-500/20 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 group cursor-pointer transition-all duration-300 relative overflow-hidden'
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="z-10">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                                Exclusive Deals
                            </span>
                            <p className='text-2xl sm:text-3xl font-bold text-white leading-tight'>
                                20%<br />discounts
                            </p>
                            <p className='flex items-center gap-1.5 text-xs font-semibold text-blue-300/90 mt-5 group-hover:text-blue-300 transition-colors'>
                                View more 
                                <ArrowRightIcon className='group-hover:translate-x-1.5 transition-transform' size={15} /> 
                            </p>
                        </div>
                        <div className="w-28 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <Image 
                                className='w-full h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]' 
                                src={assets.hero_product_img2} 
                                alt="discount_products" 
                            />
                        </div>
                    </Link>

                </div>
            </div>

            {/* Categories Marquee Section */}
            <div className="pt-2">
                <CategoriesMarquee />
            </div>
        </div>
    )
}

export default Hero