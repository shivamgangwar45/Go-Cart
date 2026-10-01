'use client'

import React, { useState } from 'react'
import { X, Star, Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ReviewModal({ isOpen, onClose, productId, onSubmitReview }) {
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be under 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!review.trim()) {
      toast.error("Please add a review comment")
      return
    }

    setIsSubmitting(true)
    try {
      const newReview = {
        id: `rev_${Date.now()}`,
        productId,
        rating: Number(rating),
        review: review.trim(),
        userImage: imagePreview || null,
        isVerified: true,
        createdAt: new Date().toISOString(),
        userName: 'Shivam Gangwar',
      }

      await onSubmitReview(newReview)
      toast.success("Review submitted successfully!")
      onClose()
    } catch {
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Write a Review</h3>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
              <CheckCircle2 size={12} /> Verified Purchase Tag will be attached
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Interactive Slider */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Your Rating: {rating} Stars</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:scale-110 transition active:scale-95"
                >
                  <Star
                    size={26}
                    className={rating >= star ? 'text-emerald-400 fill-emerald-400' : 'text-slate-700'}
                  />
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Review Feedback</label>
            <textarea
              rows={4}
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like or dislike about this product?"
              className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 transition"
            />
          </div>

          {/* Image Upload Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Attach Product Photo (Optional)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl cursor-pointer text-xs text-slate-300 hover:text-white transition">
                <Upload size={14} className="text-emerald-400" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative size-12 rounded-lg overflow-hidden border border-emerald-500/40">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-0 right-0 bg-black/70 p-0.5 text-white hover:text-rose-400"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              {isSubmitting ? 'Posting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}