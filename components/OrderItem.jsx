'use client'
import Image from "next/image";
import { DotIcon, ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";

// Tracking Stepper Configuration
const TRACKING_STEPS = [
    { key: "ORDER_PLACED", label: "Placed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    { key: "DELIVERED", label: "Delivered" }
];

const OrderTracker = ({ status, courierName, trackingNumber }) => {
    const normalized = (status || "").toUpperCase();
    const currentIndex = TRACKING_STEPS.findIndex(step => step.key === normalized);
    const activeStep = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-2">
            <div className="flex flex-wrap justify-between items-center mb-4 pb-2 border-b border-slate-200 text-xs text-slate-600 gap-2">
                <div>
                    <span className="font-semibold text-slate-700">Courier: </span>
                    {courierName || "GoCart Express"}
                </div>
                <div>
                    <span className="font-semibold text-slate-700">Tracking No: </span>
                    <span className="font-mono text-slate-800">{trackingNumber || "TRK-" + Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
            </div>

            <div className="flex items-center justify-between relative max-w-xl mx-auto py-2">
                {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = idx <= activeStep;
                    const isCurrent = idx === activeStep;

                    return (
                        <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {/* Connecting Line */}
                            {idx !== 0 && (
                                <div
                                    className={`absolute top-3.5 right-1/2 w-full h-0.5 -z-0 transition-all ${
                                        idx <= activeStep ? "bg-green-600" : "bg-slate-200"
                                    }`}
                                />
                            )}

                            {/* Circle Indicator */}
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-all ${
                                    isCompleted
                                        ? "bg-green-600 text-white shadow-sm ring-2 ring-green-100"
                                        : "bg-slate-200 text-slate-500"
                                }`}
                            >
                                {isCompleted ? "✓" : idx + 1}
                            </div>

                            {/* Step Label */}
                            <span
                                className={`mt-2 text-[10px] sm:text-xs text-center ${
                                    isCurrent
                                        ? "font-bold text-green-700"
                                        : isCompleted
                                        ? "text-slate-700 font-medium"
                                        : "text-slate-400"
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
};

const OrderItem = ({ order }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);
    const [showTracking, setShowTracking] = useState(false);

    const { ratings } = useSelector(state => state.rating);

    const isDelivered = (order.status || '').toLowerCase() === 'delivered';
    const isConfirmed = (order.status || '').toLowerCase() === 'confirmed';

    return (
        <>
            <tr className="text-sm">
                <td className="text-left py-4">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md overflow-hidden">
                                    <Image
                                        className="h-14 w-auto object-contain"
                                        src={item.product?.images?.[0] || "/placeholder.png"}
                                        alt={item.product?.name || "product_img"}
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product?.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity}</p>
                                    <p className="mb-1 text-slate-400 text-xs">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product?.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product?.id === rating.productId).rating} />
                                            : <button
                                                onClick={() => setRatingModal({ orderId: order.id, productId: item.product?.id })}
                                                className={`text-green-500 text-xs hover:underline transition ${order.status?.toUpperCase() !== "DELIVERED" && 'hidden'}`}
                                            >
                                                Rate Product
                                            </button>
                                        }
                                    </div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center font-medium text-slate-700 max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden text-xs text-slate-600">
                    <p>{order.address?.name}, {order.address?.street},</p>
                    <p>{order.address?.city}, {order.address?.state}, {order.address?.zip}, {order.address?.country},</p>
                    <p>{order.address?.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div className="flex flex-col items-start gap-1">
                        <div
                            className={`flex items-center justify-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                isConfirmed
                                    ? 'text-yellow-600 bg-yellow-100'
                                    : isDelivered
                                    ? 'text-green-600 bg-green-100'
                                    : 'text-slate-600 bg-slate-100'
                            }`}
                        >
                            <DotIcon size={12} className="scale-250" />
                            {order.status?.split('_').join(' ').toLowerCase()}
                        </div>

                        {/* Track Order Toggle Button */}
                        <button
                            onClick={() => setShowTracking(prev => !prev)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium underline mt-1"
                        >
                            {showTracking ? "Hide Tracking" : "Track Order"}
                            {showTracking ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Mobile View Address & Status */}
            <tr className="md:hidden">
                <td colSpan={4} className="pt-2">
                    <div className="text-xs text-slate-600 space-y-1">
                        <p>{order.address?.name}, {order.address?.street}</p>
                        <p>{order.address?.city}, {order.address?.state}, {order.address?.zip}, {order.address?.country}</p>
                        <p>{order.address?.phone}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <span className='px-4 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                            • {order.status?.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        <button
                            onClick={() => setShowTracking(prev => !prev)}
                            className="text-xs text-blue-600 font-medium underline"
                        >
                            {showTracking ? "Hide Tracking" : "Track Order"}
                        </button>
                    </div>
                </td>
            </tr>

            {/* Expandable Live Tracking Timeline */}
            {showTracking && (
                <tr>
                    <td colSpan={4} className="py-2">
                        <OrderTracker
                            status={order.status}
                            courierName={order.courierName}
                            trackingNumber={order.trackingNumber}
                        />
                    </td>
                </tr>
            )}

            <tr>
                <td colSpan={4} className="py-2">
                    <div className="border-b border-slate-200 w-full" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem;