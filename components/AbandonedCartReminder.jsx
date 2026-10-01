'use client'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const EMPTY_OBJECT = {}

export default function AbandonedCartReminder() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const cartItems = useSelector((state) => state?.cart?.cartItems ?? EMPTY_OBJECT)
  const totalCartCount = Object.values(cartItems).reduce((acc, qty) => acc + (Number(qty) || 0), 0)

  useEffect(() => {
    if (totalCartCount === 0 || pathname.includes('/cart') || pathname.includes('/orders') || dismissed) {
      setVisible(false)
      return
    }

    // 1. Mouse leaving viewport (Exit Intent)
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !dismissed) {
        setVisible(true)
      }
    }

    // 2. Idle timer (User inactive for 25 seconds)
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true)
    }, 25000)

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(timer)
    }
  }, [totalCartCount, pathname, dismissed])

  if (!visible || totalCartCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#111827]/95 border border-emerald-500/40 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShoppingBag size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              Items waiting in cart!
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.2 rounded-full font-mono">
                {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
              </span>
            </p>
            <p className="text-[11px] text-slate-400">Complete your checkout before stock runs out.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            onClick={() => setVisible(false)}
            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            Checkout <ArrowRight size={13} />
          </Link>

          <button
            onClick={() => {
              setVisible(false)
              setDismissed(true)
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}