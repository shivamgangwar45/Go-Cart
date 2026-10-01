'use client'

import React, { useState } from 'react'
import { X, Tag, Plus, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCouponModal({ isOpen, onClose, onCouponCreated }) {
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [type, setType] = useState('PERCENTAGE')
  const [minCart, setMinCart] = useState('0')
  const [description, setDescription] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    if (!code.trim() || !discount) {
      toast.error('Code and discount amount required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          discount,
          type,
          minCart,
          description,
          expiryDate: expiryDate || null,
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success(`Coupon ${code.toUpperCase()} created successfully!`)
        if (onCouponCreated) onCouponCreated(data.coupon)
        onClose()
      } else {
        toast.error(data.message || 'Failed to create coupon')
      }
    } catch {
      toast.error('Server error creating coupon')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-emerald-400" />
            <h3 className="text-base font-bold text-white">Create New Promo Code</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white transition">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Coupon Code</label>
            <input
              type="text"
              required
              placeholder="e.g. DIWALI20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 uppercase font-mono tracking-wider outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Discount Value</label>
              <input
                type="number"
                required
                placeholder="e.g. 20"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2.5 outline-none"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Cash (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Min Cart Value</label>
              <input
                type="number"
                value={minCart}
                onChange={(e) => setMinCart(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-slate-300 rounded-xl px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. Flat 20% festive discount"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition uppercase tracking-wider text-xs"
            >
              {loading ? 'Creating...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}