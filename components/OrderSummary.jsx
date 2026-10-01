'use client'
import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import AddressModal from './AddressModal';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    const finalAmount = coupon 
        ? (totalPrice - (coupon.discount / 100 * totalPrice)) 
        : totalPrice;

    const handleCouponCode = async (event) => {
        event.preventDefault();
        // Coupon validation logic
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        // 1. Cash on Delivery
        if (paymentMethod === 'COD') {
            router.push('/orders');
            return;
        }

        // 2. Stripe Checkout
        if (paymentMethod === 'STRIPE') {
            try {
                const res = await fetch('/api/stripe/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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

        // 3. Razorpay Checkout (Cards, Netbanking, Wallets)
        if (paymentMethod === 'RAZORPAY') {
            try {
                const res = await fetch('/api/razorpay/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: finalAmount })
                });
                const orderData = await res.json();

                if (!orderData?.id) {
                    toast.error("Failed to create Razorpay order");
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: orderData.amount,
                    currency: "INR",
                    name: "GoCart",
                    description: "Order Payment",
                    order_id: orderData.id,
                    handler: async function (response) {
                        toast.success("Payment Successful!");
                        router.push('/orders');
                    },
                    prefill: {
                        name: selectedAddress?.name || "Customer",
                        email: "test@example.com",
                        contact: selectedAddress?.phone || "9999999999",
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

            <div className='w-full max-w-lg lg:max-w-[360px] bg-[#111827] border border-slate-700/80 text-slate-200 text-sm rounded-2xl p-6 shadow-2xl space-y-4'>
                <h2 className='text-xl font-bold text-white tracking-tight border-b border-slate-700 pb-3'>Payment Summary</h2>
                
                {/* Payment Methods */}
                <div>
                    <p className='text-slate-400 text-xs uppercase tracking-wider font-bold mb-3'>Payment Method</p>

                    <div className='space-y-2'>
                        {/* COD Option */}
                        <label className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'COD'
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                                : 'bg-slate-900/50 border-slate-700/70 text-slate-300 hover:border-slate-600'
                        }`}>
                            <input 
                                type="radio" 
                                id="COD" 
                                name="paymentMethod" 
                                onChange={() => setPaymentMethod('COD')} 
                                checked={paymentMethod === 'COD'} 
                                className='accent-emerald-500 w-4 h-4 cursor-pointer' 
                            />
                            <span className='font-medium text-sm'>COD (Cash on Delivery)</span>
                        </label>

                        {/* Stripe Option */}
                        <label className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'STRIPE'
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                                : 'bg-slate-900/50 border-slate-700/70 text-slate-300 hover:border-slate-600'
                        }`}>
                            <input 
                                type="radio" 
                                id="STRIPE" 
                                name="paymentMethod" 
                                onChange={() => setPaymentMethod('STRIPE')} 
                                checked={paymentMethod === 'STRIPE'} 
                                className='accent-emerald-500 w-4 h-4 cursor-pointer' 
                            />
                            <span className='font-medium text-sm'>Stripe Payment</span>
                        </label>

                        {/* Razorpay Option */}
                        <label className={`flex gap-3 items-center p-2.5 rounded-xl border cursor-pointer transition-all ${
                            paymentMethod === 'RAZORPAY'
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                                : 'bg-slate-900/50 border-slate-700/70 text-slate-300 hover:border-slate-600'
                        }`}>
                            <input 
                                type="radio" 
                                id="RAZORPAY" 
                                name="paymentMethod" 
                                onChange={() => setPaymentMethod('RAZORPAY')} 
                                checked={paymentMethod === 'RAZORPAY'} 
                                className='accent-emerald-500 w-4 h-4 cursor-pointer' 
                            />
                            <span className='font-medium text-sm'>Razorpay (Cards, UPI, Wallets)</span>
                        </label>
                    </div>
                </div>

                {/* Address Section */}
                <div className='pt-3 border-t border-slate-700/80'>
                    <p className='text-slate-400 text-xs uppercase tracking-wider font-bold mb-2'>Delivery Address</p>
                    {
                        selectedAddress ? (
                            <div className='flex justify-between items-center bg-slate-900/70 border border-slate-700 p-3 rounded-xl text-slate-100 text-xs'>
                                <p className='leading-relaxed'>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                                <button type="button" onClick={() => setSelectedAddress(null)} className='text-emerald-400 hover:text-emerald-300 ml-2 p-1'>
                                    <SquarePenIcon size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className='space-y-2'>
                                {
                                    addressList.length > 0 && (
                                        <select 
                                            className='bg-slate-900 border border-slate-600 text-slate-100 p-2.5 w-full text-xs outline-none rounded-xl focus:border-emerald-500' 
                                            onChange={(e) => setSelectedAddress(e.target.value !== "" ? addressList[e.target.value] : null)}
                                        >
                                            <option value="" className="text-slate-400">Select Address</option>
                                            {
                                                addressList.map((address, index) => (
                                                    <option key={index} value={index} className="text-white bg-slate-900">
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
                                    <PlusIcon size={15} /> Add New Address
                                </button>
                            </div>
                        )
                    }
                </div>

                {/* Subtotal & Coupon */}
                <div className='pt-3 pb-2 border-t border-slate-700/80 space-y-2'>
                    <div className='flex justify-between text-xs text-slate-300'>
                        <p>Subtotal:</p>
                        <p className='font-semibold text-white'>{currency}{totalPrice.toLocaleString()}</p>
                    </div>
                    <div className='flex justify-between text-xs text-slate-300'>
                        <p>Shipping:</p>
                        <p className='font-semibold text-emerald-400'>Free</p>
                    </div>
                    {coupon && (
                        <div className='flex justify-between text-xs text-emerald-400 font-medium'>
                            <p>Coupon Discount:</p>
                            <p>-{currency}{(coupon.discount / 100 * totalPrice).toFixed(2)}</p>
                        </div>
                    )}

                    {/* Coupon Input */}
                    <div className='pt-2'>
                        {
                            !coupon ? (
                                <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex gap-2'>
                                    <input 
                                        onChange={(e) => setCouponCodeInput(e.target.value)} 
                                        value={couponCodeInput} 
                                        type="text" 
                                        placeholder='Coupon Code' 
                                        className='bg-slate-900 border border-slate-600 px-3 py-2 rounded-xl w-full text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500' 
                                    />
                                    <button className='bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 rounded-xl border border-slate-600 transition active:scale-95'>
                                        Apply
                                    </button>
                                </form>
                            ) : (
                                <div className='w-full flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-2 rounded-xl text-xs'>
                                    <p>Code: <strong className='tracking-wider'>{coupon.code.toUpperCase()}</strong> ({coupon.description})</p>
                                    <XIcon size={16} onClick={() => setCoupon('')} className='hover:text-rose-400 transition cursor-pointer' />
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Total */}
                <div className='flex justify-between items-center py-2 border-t border-slate-700/80'>
                    <p className='text-sm font-semibold text-slate-300'>Total:</p>
                    <p className='text-2xl font-black text-white'>{currency}{finalAmount.toFixed(2)}</p>
                </div>

                {/* Place Order CTA Button */}
                <button 
                    onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'Processing Order...' })} 
                    className='w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-sm'
                >
                    Place Order
                </button>

                {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
            </div>
        </>
    );
};

export default OrderSummary;