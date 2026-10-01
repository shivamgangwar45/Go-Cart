'use client'

import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Track which coupon is being edited (null = Add Mode)
  const [editingCoupon, setEditingCoupon] = useState(null)

  // Form State
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [description, setDescription] = useState('')
  const [expiresAt, setExpiresAt] = useState('2026-10-01')
  const [forNewUser, setForNewUser] = useState(false)
  const [forMember, setForMember] = useState(false)
  const [isPublic, setIsPublic] = useState(true) // Prisma Schema Required Argument

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/coupon')
      const data = await res.json()
      if (data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons)
      }
    } catch (err) {
      console.error('Failed to load coupons:', err)
      toast.error('Coupons load nahi ho paye')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  // Jab user Table me "Pencil / Edit" par click kare
  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon)
    setCode(coupon.code)
    setDiscount(coupon.discount)
    setDescription(coupon.description || '')
    setExpiresAt(
      coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split('T')[0]
        : '2026-10-01'
    )
    setForNewUser(Boolean(coupon.forNewUser))
    setForMember(Boolean(coupon.forMember))
    setIsPublic(coupon.isPublic !== undefined ? Boolean(coupon.isPublic) : true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingCoupon(null)
    setCode('')
    setDiscount('')
    setDescription('')
    setExpiresAt('2026-10-01')
    setForNewUser(false)
    setForMember(false)
    setIsPublic(true)
  }

  // Submit Handler (Add vs Update)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!code.trim() || discount === '') {
      toast.error('Coupon code aur discount amount zaroori hain')
      return
    }

    setSubmitting(true)

    try {
      const isEditing = Boolean(editingCoupon)
      const method = isEditing ? 'PUT' : 'POST'

      const payload = {
        code: code.trim().toUpperCase(),
        discount: parseFloat(discount),
        description: description.trim(),
        expiresAt,
        forNewUser,
        forMember,
        isPublic, // Fixes PrismaClientValidationError: Argument isPublic is missing
        originalCode: isEditing ? editingCoupon.code : undefined,
      }

      const res = await fetch('/api/coupon', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        toast.success(isEditing ? 'Coupon updated successfully!' : 'Coupon added!')
        handleCancelEdit()
        fetchCoupons()
      } else {
        toast.error(data.message || 'Operation fail ho gaya')
      }
    } catch (err) {
      console.error('Coupon submit error:', err)
      toast.error('Server error. Dobara try karein.')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete Handler
  const handleDelete = async (couponCode) => {
    if (!confirm(`Kya aap "${couponCode}" coupon delete karna chahte hain?`)) return

    try {
      const res = await fetch(`/api/coupon?code=${encodeURIComponent(couponCode)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Coupon deleted')
        fetchCoupons()
      } else {
        toast.error(data.message || 'Delete fail ho gaya')
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete coupon')
    }
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 py-8 px-4 sm:px-8 space-y-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ================= FORM CARD ================= */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Tag className="text-emerald-400" size={22} />
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Add Coupons'}
              </h2>
            </div>

            {editingCoupon && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 active:scale-95 transition"
              >
                <X size={14} /> Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Row 1: Code & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  className="w-full bg-[#070b12] border border-slate-700/80 focus:border-emerald-500 text-white rounded-xl px-4 py-3 uppercase tracking-wider font-mono outline-none transition"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Coupon Discount (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 20"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                  min="1"
                  max="100"
                  className="w-full bg-[#070b12] border border-slate-700/80 focus:border-emerald-500 text-white rounded-xl px-4 py-3 outline-none transition"
                />
              </div>
            </div>

            {/* Row 2: Description */}
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Coupon Description</label>
              <input
                type="text"
                placeholder="e.g. Flat festive season discount"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#070b12] border border-slate-700/80 focus:border-emerald-500 text-white rounded-xl px-4 py-3 outline-none transition"
              />
            </div>

            {/* Row 3: Expiry Date */}
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Coupon Expiry Date</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full bg-[#070b12] border border-slate-700/80 focus:border-emerald-500 text-white rounded-xl px-4 py-3 outline-none transition [color-scheme:dark]"
              />
            </div>

            {/* Toggles (New User, Member, Public) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForNewUser(!forNewUser)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    forNewUser ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block size-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${
                      forNewUser ? 'translate-x-5.5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-slate-300 font-medium">For New User</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForMember(!forMember)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    forMember ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block size-4.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ${
                      forMember ? 'translate-x-5.5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-slate-300 font-medium">For Member</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-[#1d273a] hover:bg-[#283650] disabled:opacity-50 text-white font-bold rounded-xl transition duration-150 active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
              >
                {submitting
                  ? 'Saving...'
                  : editingCoupon
                  ? 'Update Coupon'
                  : 'Add Coupon'}
              </button>
            </div>
          </form>
        </div>

        {/* ================= COUPONS LIST TABLE ================= */}
        <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white tracking-wide">
            List Coupons ({coupons.length})
          </h3>

          {loading ? (
            <p className="text-xs text-slate-500">Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="text-xs text-slate-500">Koi coupon create nahi kiya gaya hai.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] pb-2">
                    <th className="py-3 px-2">Code</th>
                    <th className="py-3 px-2">Discount</th>
                    <th className="py-3 px-2">Description</th>
                    <th className="py-3 px-2">Expires</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {coupons.map((coupon) => (
                    <tr key={coupon.code} className="hover:bg-slate-900/40 transition">
                      <td className="py-3.5 px-2 font-mono font-bold text-emerald-400">
                        {coupon.code}
                      </td>
                      <td className="py-3.5 px-2 font-bold text-white">
                        {coupon.discount}% OFF
                      </td>
                      <td className="py-3.5 px-2 text-slate-400 max-w-[200px] truncate">
                        {coupon.description || '—'}
                      </td>
                      <td className="py-3.5 px-2 text-slate-400">
                        {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Trigger */}
                          <button
                            type="button"
                            onClick={() => handleEditClick(coupon)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition active:scale-95 cursor-pointer"
                            title="Edit this coupon"
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete Trigger */}
                          <button
                            type="button"
                            onClick={() => handleDelete(coupon.code)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition active:scale-95 cursor-pointer"
                            title="Delete this coupon"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}