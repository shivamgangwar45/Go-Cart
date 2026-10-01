'use client'

import React from 'react'
import { Star, CheckCircle2 } from 'lucide-react'

export default function ReviewBreakdown({ reviews = [], onWriteReviewClick }) {
  const totalReviews = reviews.length

  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) / totalReviews).toFixed(1)
    : '0.0'

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(Number(r.rating)) === stars).length
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    return { stars, count, percentage }
  })

  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Customer Reviews</h3>
          <p className="text-xs text-slate-400 mt-1">Real feedback from verified buyers</p>
        </div>

        <button
          onClick={onWriteReviewClick}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Overall Score */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0b0f17] border border-slate-800/70 rounded-2xl text-center">
          <span className="text-5xl font-black text-white">{averageRating}</span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={Number(averageRating) >= star ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">Based on {totalReviews} global ratings</span>
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-3">
            <CheckCircle2 size={13} /> 100% Verified Purchases
          </span>
        </div>

        {/* Progress Bars */}
        <div className="lg:col-span-8 space-y-2.5">
          {distribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-300 font-medium shrink-0">{stars} Star</span>

              <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-10 text-right text-slate-400 font-mono text-[11px] shrink-0">
                {percentage}%
              </span>
              <span className="w-8 text-right text-slate-500 text-[10px] shrink-0">
                ({count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}