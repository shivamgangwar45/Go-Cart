'use client'

import React, { useState } from 'react'
import { MapPin, Truck, CheckCircle2, AlertCircle, Clock } from 'lucide-react'

export default function PincodeChecker() {
  const [pincode, setPincode] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = (e) => {
    e.preventDefault()
    if (!pincode.trim() || pincode.trim().length !== 6 || isNaN(pincode)) {
      setResult({ error: 'Please enter a valid 6-digit Indian PIN code' })
      return
    }

    setLoading(true)
    setTimeout(() => {
      // Estimated delivery date: 3 din baad ka date calculate karein
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 3)
      const options = { weekday: 'short', day: 'numeric', month: 'short' }
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', options)

      setResult({
        date: formattedDate,
        cod: true,
        freeDelivery: true,
      })
      setLoading(false)
    }, 400)
  }

  return (
    <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-white">
        <Truck size={16} className="text-emerald-400" />
        <span>Delivery Options &amp; Speed</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''))
              setResult(null)
            }}
            placeholder="Enter 6-digit PIN code"
            className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition active:scale-95 shrink-0"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {/* Result Card */}
      {result && !result.error && (
        <div className="bg-[#0b0f17] border border-slate-800 rounded-xl p-3 space-y-2 text-xs animate-in fade-in">
          <div className="flex items-center gap-1.5 text-white font-semibold">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Delivery by <strong className="text-emerald-400">{result.date}</strong></span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Free express delivery
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Cash on Delivery available
            </span>
          </div>
        </div>
      )}

      {result?.error && (
        <div className="flex items-center gap-1.5 text-rose-400 text-xs">
          <AlertCircle size={14} />
          <span>{result.error}</span>
        </div>
      )}

      <p className="text-[10px] text-slate-500">
        Orders dispatched within 24 hours from Bareilly Central Hub.
      </p>
    </div>
  )
}