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
                        name: selectedAddress?.name || "Shivam Gangwar",
                        email: "test@example.com",
                        contact: selectedAddress?.phone || "9999999999",
                    },
                    theme: { color: "#334155" }
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

            <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
                <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
                <p className='text-slate-400 text-xs my-4'>Payment Method</p>

                {/* COD Option */}
                <div className='flex gap-2 items-center'>
                    <input 
                        type="radio" 
                        id="COD" 
                        name="paymentMethod" 
                        onChange={() => setPaymentMethod('COD')} 
                        checked={paymentMethod === 'COD'} 
                        className='accent-gray-500 cursor-pointer' 
                    />
                    <label htmlFor="COD" className='cursor-pointer'>COD</label>
                </div>

                {/* Stripe Option */}
                <div className='flex gap-2 items-center mt-2'>
                    <input 
                        type="radio" 
                        id="STRIPE" 
                        name="paymentMethod" 
                        onChange={() => setPaymentMethod('STRIPE')} 
                        checked={paymentMethod === 'STRIPE'} 
                        className='accent-gray-500 cursor-pointer' 
                    />
                    <label htmlFor="STRIPE" className='cursor-pointer'>Stripe Payment</label>
                </div>

                {/* Razorpay Option */}
                <div className='flex gap-2 items-center mt-2'>
                    <input 
                        type="radio" 
                        id="RAZORPAY" 
                        name="paymentMethod" 
                        onChange={() => setPaymentMethod('RAZORPAY')} 
                        checked={paymentMethod === 'RAZORPAY'} 
                        className='accent-gray-500 cursor-pointer' 
                    />
                    <label htmlFor="RAZORPAY" className='cursor-pointer'>Razorpay (Cards, Netbanking, Wallets)</label>
                </div>

                <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                    <p>Address</p>
                    {
                        selectedAddress ? (
                            <div className='flex gap-2 items-center mt-2 text-slate-700'>
                                <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                                <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer shrink-0' size={18} />
                            </div>
                        ) : (
                            <div>
                                {
                                    addressList.length > 0 && (
                                        <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                            <option value="">Select Address</option>
                                            {
                                                addressList.map((address, index) => (
                                                    <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                }
                                <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                            </div>
                        )
                    }
                </div>

                <div className='pb-4 border-b border-slate-200'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-1 text-slate-400'>
                            <p>Subtotal:</p>
                            <p>Shipping:</p>
                            {coupon && <p>Coupon:</p>}
                        </div>
                        <div className='flex flex-col gap-1 font-medium text-right'>
                            <p>{currency}{totalPrice.toLocaleString()}</p>
                            <p>Free</p>
                            {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                        </div>
                    </div>
                    {
                        !coupon ? (
                            <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                                <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                                <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Apply</button>
                            </form>
                        ) : (
                            <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                                <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                                <p>{coupon.description}</p>
                                <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                            </div>
                        )
                    }
                </div>

                <div className='flex justify-between py-4'>
                    <p>Total:</p>
                    <p className='font-medium text-right'>{currency}{finalAmount.toFixed(2)}</p>
                </div>

                <button 
                    onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'Processing Order...' })} 
                    className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all cursor-pointer'
                >
                    Place Order
                </button>

                {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
            </div>
        </>
    );
};

export default OrderSummary;