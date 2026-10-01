'use client'
import React from 'react';
import { CheckCircle2, Clock, Truck, Package, Home } from 'lucide-react';

const steps = [
  { label: 'Order Placed', icon: Clock, key: 'Placed' },
  { label: 'Processing', icon: Package, key: 'Processing' },
  { label: 'Shipped', icon: Truck, key: 'Shipped' },
  { label: 'Out for Delivery', icon: Truck, key: 'OutForDelivery' },
  { label: 'Delivered', icon: Home, key: 'Delivered' },
];

export default function OrderTracker({ currentStatus = 'Placed' }) {
  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out for delivery':
      case 'outfordelivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        
        {/* Background Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 -z-0" />
        
        {/* Active Progress Green Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
          style={{ width: `${(activeIndex / (steps.length - 1)) * 90}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const StepIcon = step.icon;

          return (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div
                className={`size-10 sm:size-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-[#0b0f17] border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/20 animate-pulse'
                    : 'bg-[#111827] border-slate-800 text-slate-500'
                }`}
              >
                {isCompleted ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <StepIcon size={18} />}
              </div>

              <span
                className={`text-[10px] sm:text-xs font-semibold mt-2.5 text-center max-w-[70px] sm:max-w-none transition-colors ${
                  isCurrent
                    ? 'text-emerald-400 font-bold'
                    : isCompleted
                    ? 'text-slate-200'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}