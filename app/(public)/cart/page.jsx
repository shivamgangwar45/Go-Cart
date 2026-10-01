'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

export default function Cart() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const cartItems = useSelector(state => state?.cart?.cartItems ?? EMPTY_OBJECT);
    const products = useSelector(state => state?.product?.list ?? EMPTY_ARRAY);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        let total = 0;
        const newCartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            if (value <= 0) continue;
            const product = products.find(p => String(p.id) === String(key));
            if (product) {
                newCartArray.push({
                    ...product,
                    quantity: value,
                });
                total += (Number(product.price) || 0) * value;
            }
        }
        setTotalPrice(total);
        setCartArray(newCartArray);
    };

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }));
    };

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen bg-[#0b0f17] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Page Title & Back to Shop */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                    <PageTitle heading="My Cart" text={`${cartArray.length} items currently in your cart`} linkText="Add more" />
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition w-fit"
                    >
                        <ArrowLeft size={16} /> Continue Shopping
                    </Link>
                </div>

                <div className="flex items-start justify-between gap-8 max-lg:flex-col">

                    {/* Cart Items Table */}
                    <div className="w-full max-w-4xl bg-[#111827] border border-slate-800/80 rounded-2xl p-6 shadow-xl overflow-x-auto">
                        <table className="w-full text-slate-300 table-auto">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 pb-3">
                                    <th className="text-left pb-4 font-semibold">Product</th>
                                    <th className="text-center pb-4 font-semibold">Quantity</th>
                                    <th className="text-center pb-4 font-semibold">Total Price</th>
                                    <th className="text-center pb-4 font-semibold max-md:hidden">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {cartArray.map((item, index) => {
                                    const imageSrc = typeof item?.images?.[0] === 'object' && item?.images?.[0]?.src
                                        ? item.images[0].src
                                        : (item?.images?.[0] || '/placeholder.png');

                                    return (
                                        <tr key={item.id || index} className="group">
                                            <td className="flex gap-4 py-4 items-center">
                                                <div className="relative bg-[#0b0f17] border border-slate-800 size-16 sm:size-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                                                    <Image 
                                                        src={imageSrc} 
                                                        alt={item.name || "Product"} 
                                                        width={60} 
                                                        height={60} 
                                                        className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">{item.name}</p>
                                                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{item.category}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{currency}{item.price}</p>
                                                </div>
                                            </td>
                                            <td className="text-center py-4">
                                                <div className="flex justify-center">
                                                    <Counter productId={item.id} />
                                                </div>
                                            </td>
                                            <td className="text-center py-4 text-sm font-bold text-white">
                                                {currency}{(item.price * item.quantity).toLocaleString()}
                                            </td>
                                            <td className="text-center py-4 max-md:hidden">
                                                <button 
                                                    onClick={() => handleDeleteItemFromCart(item.id)} 
                                                    className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 p-2.5 rounded-xl active:scale-95 transition-all"
                                                    title="Remove Item"
                                                >
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Summary with Auth Protection */}
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] bg-[#0b0f17] text-slate-100 flex items-center justify-center px-4">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto space-y-4 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <ShoppingBag size={28} />
                </div>
                <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Looks like you haven&apos;t added any items to your shopping cart yet.
                </p>
                <div className="pt-2">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}