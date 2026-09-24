import React from 'react';

const STEPS = [
  { id: 'ORDER_PLACED', label: 'Order Placed' },
  { id: 'PROCESSING', label: 'Processing' },
  { id: 'SHIPPED', label: 'Shipped' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' },
];

export default function OrderTracker({ currentStatus }) {
  // Current status ka index pata karna
  const activeIndex = STEPS.findIndex((step) => step.id === currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="flex-1 relative flex flex-col items-center">
              {/* Connecting Bar */}
              {index !== 0 && (
                <div
                  className={`absolute top-3 right-1/2 w-full h-1 -z-0 transition-all ${
                    index <= activeIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Circle / Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {/* Status Label */}
              <span
                className={`mt-2 text-[11px] font-medium text-center ${
                  isCurrent ? 'text-emerald-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
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