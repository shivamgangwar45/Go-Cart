'use client'
import React, { useState, useEffect } from 'react';
import OrderTracker from '@/components/OrderTracker';
import { generateInvoicePDF } from '@/lib/generateInvoice';
import { Download, PackageCheck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹';

  useEffect(() => {
    // Simulated fetch or replace with real endpoint: /api/orders
    const fetchOrders = async () => {
      try {
        const dummyOrder = [
          {
            id: 'ord_91823764812',
            createdAt: new Date().toISOString(),
            status: 'Processing',
            isPaid: true,
            totalAmount: 800,
            address: {
              fullName: 'Shivam Gangwar',
              street: 'Bhojipura',
              city: 'Bareilly',
              state: 'UP',
              pincode: '243001',
              phone: '+91 8433210134'
            },
            orderItems: [
              {
                id: 'item_1',
                price: 400,
                quantity: 2,
                product: {
                  id: 'prod_1',
                  name: 'Modern Table Lamp',
                  images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500']
                }
              }
            ]
          }
        ];
        setOrders(dummyOrder);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <div className="flex items-center gap-3">
            <PackageCheck size={28} className="text-emerald-400" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Your Orders</h1>
              <p className="text-xs text-slate-400">Track shipments & download invoices</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Explore More Products
          </Link>
        </div>

        {/* Orders Listing */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto">
            <ShoppingBag className="mx-auto text-slate-600" size={36} />
            <h2 className="text-lg font-bold text-white">No orders placed yet</h2>
            <Link
              href="/shop"
              className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 space-y-6 shadow-xl">
                
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 text-xs">
                  <div>
                    <span className="text-slate-400">Order ID: </span>
                    <span className="text-white font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      order.isPaid
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {order.isPaid ? 'PAID' : 'COD / UNPAID'}
                    </span>

                    {/* Download Invoice Button */}
                    <button
                      onClick={() => generateInvoicePDF(order)}
                      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl transition font-medium"
                    >
                      <Download size={13} className="text-emerald-400" />
                      Invoice
                    </button>
                  </div>
                </div>

                {/* Interactive Status Stepper */}
                <div className="px-2">
                  <OrderTracker currentStatus={order.status} />
                </div>

                {/* Items in this Order */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                          <Image
                            src={item.product?.images?.[0] || '/placeholder.png'}
                            alt={item.product?.name || 'Product'}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-200 line-clamp-1">{item.product?.name}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-white">
                        {currency}{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Footer Total */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-base font-black text-emerald-400">{currency}{order.totalAmount}</span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}