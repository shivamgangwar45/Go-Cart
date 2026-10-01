'use client'

import React, { useState } from 'react';
import { X, RotateCcw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReturnModal({ isOpen, onClose, order, onReturnSuccess }) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      toast.error("Please select a return reason");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/order/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          reason,
          details,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Return request submitted successfully!");
        onReturnSuccess(order.id);
        onClose();
      } else {
        toast.error(data.message || "Failed to submit return request");
      }
    } catch {
      toast.error("Error submitting return request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <RotateCcw className="text-emerald-400" size={20} />
            <h3 className="text-lg font-bold text-white">Return Request</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Details Preview */}
        <div className="bg-[#0b0f17] border border-slate-800/80 p-3 rounded-xl text-xs space-y-1">
          <p className="text-slate-400">Order ID: <span className="text-white font-mono font-semibold">{order.id}</span></p>
          <p className="text-slate-400">Items: <span className="text-white">{order.items?.length || 1} item(s)</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Reason Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Reason for Return</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500/80 text-white text-xs rounded-xl p-3 outline-none"
            >
              <option value="" className="text-slate-500">Select a reason</option>
              <option value="Damaged Item">Damaged or defective item</option>
              <option value="Wrong Item">Received wrong item</option>
              <option value="Quality Issue">Quality not as expected</option>
              <option value="Missing Parts">Missing items or accessories</option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          {/* Details / Comments */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold block">Additional Details (Optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe the issue with the product..."
              className="w-full bg-[#0b0f17] border border-slate-800 focus:border-emerald-500/80 text-white placeholder-slate-500 text-xs rounded-xl p-3 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
            <AlertCircle size={14} className="text-amber-400 shrink-0" />
            <span>Pickup schedule will be shared once verified by our team.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-xs uppercase tracking-wider"
            >
              {loading ? "Submitting..." : "Submit Return"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}