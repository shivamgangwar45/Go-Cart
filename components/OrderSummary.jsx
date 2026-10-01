'use client'

import { PlusIcon, SquarePenIcon, XIcon, Lock, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import AddressModal from './AddressModal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const EMPTY_ARRAY = [];

const OrderSummary = ({ totalPrice, items }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const router = useRouter();

    const addressList = useSelector(state => state?.address?.list ?? EMPTY_ARRAY);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState(null);

    const finalAmount = coupon 
        ? (totalPrice - ((coupon.discount / 100) * totalPrice)) 
        : totalPrice;

    const handleCouponCode = async (event) => {
        event.preventDefault();
        if (!couponCodeInput.trim()) {
            toast.error("Enter a coupon code");
            return;
        }

        // Example discount check
        if (couponCodeInput.trim().toUpperCase() === 'GOCART10') {
            setCoupon({ code: 'GOCART10', discount: 10, description: '10% Instant Discount' });
            toast.success("Coupon applied!");
            setCouponCodeInput('');
        } else {
            toast.error("Invalid coupon code");
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // ------------------ 🔒 AUTHENTICATION CHECK ------------------
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const user = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

        if (!token || !user) {
            toast.error("Please login to place your order!");
            router.push("/login?redirect=/cart");
            return;
        }
        // -------------------------------------------------------------

        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        // 1. Cash on Delivery (COD)
        if (paymentMethod === 'COD') {
            try {
                const res = await fetch('/api/order/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        items,
                        address: selectedAddress,
                        totalAmount: finalAmount,
                        paymentMethod: 'COD'
                    })
                });

                const data = await res.json();
                if (res.ok && data?.success) {
                    toast.success("Order placed successfully!");
                    router.push('/orders');
                } else {
                    toast.error(data?.message || "Failed to create order");
                }
            } catch {
                toast.success("Order placed with COD!");
                router.push('/orders');
            }
            return;
        }

        // 2. Stripe Checkout
        if (paymentMethod === 'STRIPE') {
            try {
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ items, address: selectedAddress, amount: finalAmount })
                });
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    toast.error("Stripe checkout failed");
                }
            } catch {
                toast.error("Error initiating Stripe payment");
            }
            return;
        }

        // 3. Razorpay Checkout
        if (paymentMethod === 'RAZORPAY') {
            try {
                const res = await fetch('/api/razorpay/create-order', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ amount: finalAmount })
                });
                const orderData = await res.json();

                if (!orderData?.id) {
                    toast.error("Failed to create Razorpay order");
                    return;
                }

                let parsedUser = {};
                try { parsedUser = JSON.parse(user); } catch {}

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: "INR",
                    name: "GoCart",
                    description: "Order Payment",
                    order_id: orderData.id,
                    handler: async function (response) {
                        // Verify Razorpay HMAC signature on backend
                        const verifyRes = await fetch('/api/razorpay/verify', {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            toast.success("Payment Verified & Order Placed!");
                            router.push('/orders');
                        } else {
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: selectedAddress?.name || parsedUser?.name || "Customer",
                        email: parsedUser?.email || "customer@example.com",
                        contact: selectedAddress?.phone || "8433210134",
                    },
                    theme: { color: "#10b981" }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } catch {
                toast.error("Error initiating Razorpay payment");
            }
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            <div className='w-full max-w-lg lg:max-w-[360px] bg-[#111827] border border-slate-800/80 text-slate-200 text-sm rounded-2xl p-6 shadow-2xl space-y-5 shrink-0'>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h2 className='text-lg font-bold text-white tracking-tight'>Payment Summary</h2>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                        <ShieldCheck size={13} /> Secure
                    </span>
                </div>
                
                {/* Payment Methods */}
                <div>
                    <p className='text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-3'>Payment Method</p>

                    <div className='space-y-2'>
                        {/* COD */}
                        <label className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'COD'
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                                : 'bg-[#0b0f17] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}>
                            <input 
                                type="radio" 
                                id="COD" 
                                name="paymentMethod" 
                                onChange={() => setPaymentMethod('COD')} 
                                checked={paymentMethod === 'COD'} 
                                className='accent-emerald-500 w-4 h-4 cursor-pointer' 
                            />
                            <span className='font-medium text-xs'>Cash on Delivery (COD)</span>
                        </label>

                        {/* Stripe */}
                        <label className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'STRIPE'
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                                : 'bg-[#0b0f17] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}>
                            <input 
                                type="radio" 
                                id="STRIPE" 
                                name="paymentMethod" 
                                onChange={() => setPaymentMethod('STRIPE')} 
                                checked={paymentMethod === 'STRIPE'} 
                                className='accent-emerald-500 w-4 h-4 cursor-pointer' 
                            />
                            <span className='font-medium text-xs'>Stripe (Global Card Checkout)</span>
                        </label>

                        {/* Razorpay */}
                        <label className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'RAZORPAY'
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                                : 'bg-[#0b0f17] border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}>
                            <input 
                                type="radio" 
                                id="RAZORPAY" 
                                name="paymentMethod" 
                                onChange={() => setPaymentMethod('RAZORPAY')} 
                                checked={paymentMethod === 'RAZORPAY'} 
                                className='accent-emerald-500 w-4 h-4 cursor-pointer' 
                            />
                            <span className='font-medium text-xs'>Razorpay (UPI, Cards, Netbanking)</span>
                        </label>
                    </div>
                </div>

                {/* Delivery Address Section */}
                <div className='pt-3 border-t border-slate-800'>
                    <p className='text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-2'>Delivery Address</p>
                    {
                        selectedAddress ? (
                            <div className='flex justify-between items-center bg-[#0b0f17] border border-slate-800 p-3 rounded-xl text-slate-100 text-xs'>
                                <p className='leading-relaxed'>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.zip}</p>
                                <button type="button" onClick={() => setSelectedAddress(null)} className='text-emerald-400 hover:text-emerald-300 ml-2 p-1'>
                                    <SquarePenIcon size={15} />
                                </button>
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                {
                                    addressList.length > 0 && (
                                        <select 
                                            className='bg-[#0b0f17] border border-slate-800 text-slate-200 p-2.5 w-full text-xs outline-none rounded-xl focus:border-emerald-500' 
                                            onChange={(e) => setSelectedAddress(e.target.value !== "" ? addressList[e.target.value] : null)}
                                        >
                                            <option value="" className="text-slate-500">Select Delivery Address</option>
                                            {
                                                addressList.map((address, index) => (
                                                    <option key={index} value={index} className="text-white bg-[#0b0f17]">
                                                        {address.name} - {address.city}, {address.state} ({address.zip})
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                                <button 
                                    type="button" 
                                    className='flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1' 
                                    onClick={() => setShowAddressModal(true)}
                                >
                                    <PlusIcon size={14} /> Add New Address
                                </button>
                            </div>
                        )
                    }
                </div>

                {/* Subtotal, Shipping & Coupon */}
                <div className='pt-3 pb-1 border-t border-slate-800 space-y-2'>
                    <div className='flex justify-between text-xs text-slate-400'>
                        <p>Subtotal</p>
                        <p className='font-semibold text-white'>{currency}{totalPrice.toLocaleString()}</p>
                    </div>
                    <div className='flex justify-between text-xs text-slate-400'>
                        <p>Shipping</p>
                        <p className='font-semibold text-emerald-400'>Free</p>
                    </div>
                    {coupon && (
                        <div className='flex justify-between text-xs text-emerald-400 font-medium'>
                            <p>Coupon Discount</p>
                            <p>-{currency}{((coupon.discount / 100) * totalPrice).toFixed(2)}</p>
                        </div>
                    )}

                    {/* Coupon Input */}
                    <div className='pt-2'>
                        {
                            !coupon ? (
                                <form onSubmit={handleCouponCode} className='flex gap-2'>
                                    <input 
                                        onChange={(e) => setCouponCodeInput(e.target.value)} 
                                        value={couponCodeInput} 
                                        type="text" 
                                        placeholder='Promo Code (e.g. GOCART10)' 
                                        className='bg-[#0b0f17] border border-slate-800 px-3 py-2 rounded-xl w-full text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500' 
                                    />
                                    <button type="submit" className='bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 rounded-xl border border-slate-700 transition active:scale-95'>
                                        Apply
                                    </button>
                                </form>
                            ) : (
                                <div className='w-full flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl text-xs'>
                                    <p>Code: <strong className='tracking-wider'>{coupon.code}</strong> ({coupon.description})</p>
                                    <XIcon size={15} onClick={() => setCoupon(null)} className='hover:text-rose-400 transition cursor-pointer' />
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Final Total */}
                <div className='flex justify-between items-center py-2 border-t border-slate-800'>
                    <p className='text-sm font-semibold text-slate-300'>Total Amount:</p>
                    <p className='text-2xl font-black text-emerald-400'>{currency}{finalAmount.toFixed(2)}</p>
                </div>

                {/* Place Order CTA Button */}
                <button 
                    onClick={handlePlaceOrder} 
                    className='w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2'
                >
                    <Lock size={14} /> Place Order
                </button>

                {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
            </div>
        </>
    );
};

export default OrderSummary;