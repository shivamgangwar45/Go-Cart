'use client'

import React from 'react'
import { Star, CheckCircle2, User } from 'lucide-react'
import Image from 'next/image'

export default function ReviewCard({ item }) {
  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
            {item.userName?.[0]?.toUpperCase() || <User size={14} />}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{item.userName || 'Anonymous'}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                <CheckCircle2 size={10} /> Verified Purchase
              </span>
            </div>
          </div>
        </div>

        <span className="text-[10px] text-slate-500">
          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
        </span>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={Number(item.rating) >= star ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-xs text-slate-300 leading-relaxed">{item.review}</p>

      {/* Uploaded Customer Photo */}
      {item.userImage && (
        <div className="pt-1">
          <div className="relative size-16 sm:size-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
            <Image
              src={item.userImage}
              alt="Customer Attachment"
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  )
}