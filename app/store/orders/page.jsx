'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { orderDummyData } from "@/assets/assets"

// Tracking Stepper Component for Modal
const ORDER_STEPS = [
    { key: "ORDER_PLACED", label: "Placed" },
    { key: "PROCESSING", label: "Processing" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
    { key: "DELIVERED", label: "Delivered" }
]

function TrackingTimeline({ currentStatus }) {
    if (currentStatus === "CANCELLED") {
        return (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-xs font-semibold text-center border border-red-200">
                Order Cancelled
            </div>
        )
    }

    const currentIndex = ORDER_STEPS.findIndex(step => step.key === currentStatus)

    return (
        <div className="w-full py-2 my-2">
            <div className="flex items-center justify-between relative">
                {ORDER_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentIndex
                    const isCurrent = idx === currentIndex

                    return (
                        <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {/* Connecting Line */}
                            {idx !== 0 && (
                                <div
                                    className={`absolute top-3.5 right-1/2 w-full h-0.5 -z-0 ${
                                        idx <= currentIndex ? "bg-emerald-500" : "bg-gray-200"
                                    }`}
                                />
                            )}
                            {/* Step Badge */}
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                                    isCompleted
                                        ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {isCompleted ? "✓" : idx + 1}
                            </div>
                            <span
                                className={`mt-1.5 text-[11px] text-center ${
                                    isCurrent ? "font-bold text-emerald-700" : isCompleted ? "text-gray-700" : "text-gray-400"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [trackingInput, setTrackingInput] = useState({ courierName: "", trackingNumber: "" })

    const fetchOrders = async () => {
        // Backend API connect hone par fetch call yahan replace kar sakte hain
        setOrders(orderDummyData)
        setLoading(false)
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        // Local state update
        setOrders(prev =>
            prev.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord)
        )
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }))
        }

        // Optional Backend API call:
        // await fetch(`/api/orders/${orderId}`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ status: newStatus })
        // })
    }

    const updateTrackingDetails = async (orderId) => {
        setOrders(prev =>
            prev.map(ord =>
                ord.id === orderId
                    ? { ...ord, courierName: trackingInput.courierName, trackingNumber: trackingInput.trackingNumber }
                    : ord
            )
        )
        setSelectedOrder(prev => ({
            ...prev,
            courierName: trackingInput.courierName,
            trackingNumber: trackingInput.trackingNumber
        }))
        alert("Tracking information updated successfully!")
    }

    const openModal = (order) => {
        setSelectedOrder(order)
        setTrackingInput({
            courierName: order.courierName || "",
            trackingNumber: order.trackingNumber || ""
        })
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">
                Store <span className="text-slate-800 font-medium">Orders</span>
            </h1>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="overflow-x-auto max-w-5xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["Sr. No.", "Customer", "Total", "Payment", "Coupon", "Tracking ID", "Status", "Date"].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="pl-6 text-green-600 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{order.user?.name}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-900">${order.total}</td>
                                    <td className="px-4 py-3">{order.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        {order.isCouponUsed ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                {order.coupon?.code}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs font-mono text-gray-500">
                                        {order.trackingNumber || <span className="text-gray-400 italic">Not Assigned</span>}
                                    </td>
                                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation() }}>
                                        <select
                                            value={order.status}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className="border border-gray-300 rounded-md text-xs py-1 px-2 focus:ring focus:ring-blue-200 font-medium text-slate-700 bg-white"
                                        >
                                            <option value="ORDER_PLACED">ORDER_PLACED</option>
                                            <option value="PROCESSING">PROCESSING</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50 p-4">
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b pb-3">
                            <h2 className="text-xl font-semibold text-slate-900">
                                Order Details <span className="text-xs font-mono text-gray-400">({selectedOrder.id})</span>
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 font-bold text-lg">
                                ✕
                            </button>
                        </div>

                        {/* Order Live Tracking Stepper */}
                        <div className="mb-5 bg-slate-50 border border-slate-200 rounded-lg p-3">
                            <h3 className="font-semibold text-xs text-slate-700 uppercase tracking-wider mb-2">Live Tracking Status</h3>
                            <TrackingTimeline currentStatus={selectedOrder.status} />
                        </div>

                        {/* Tracking Assignment Form */}
                        <div className="mb-5 bg-blue-50/60 border border-blue-200/70 rounded-lg p-3">
                            <h3 className="font-semibold text-xs text-blue-900 uppercase tracking-wider mb-2">Courier & Dispatch Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Courier Partner</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. BlueDart, Delhivery"
                                        value={trackingInput.courierName}
                                        onChange={e => setTrackingInput({ ...trackingInput, courierName: e.target.value })}
                                        className="w-full text-xs p-2 border border-gray-300 rounded bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Tracking Number / AWB</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TRK-9823101"
                                        value={trackingInput.trackingNumber}
                                        onChange={e => setTrackingInput({ ...trackingInput, trackingNumber: e.target.value })}
                                        className="w-full text-xs p-2 border border-gray-300 rounded bg-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => updateTrackingDetails(selectedOrder.id)}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 font-medium"
                                >
                                    Save Tracking Info
                                </button>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="mb-4 bg-gray-50 p-3 rounded border border-gray-100">
                            <h3 className="font-semibold mb-2 text-slate-800">Customer Details</h3>
                            <p><span className="text-gray-500">Name:</span> {selectedOrder.user?.name}</p>
                            <p><span className="text-gray-500">Email:</span> {selectedOrder.user?.email}</p>
                            <p><span className="text-gray-500">Phone:</span> {selectedOrder.address?.phone}</p>
                            <p><span className="text-gray-500">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                        </div>

                        {/* Products */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-slate-800">Products Ordered</h3>
                            <div className="space-y-2">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border border-slate-100 shadow-sm rounded p-2">
                                        <img
                                            src={item.product?.images?.[0]?.src || item.product?.images?.[0]}
                                            alt={item.product?.name}
                                            className="w-14 h-14 object-cover rounded bg-gray-100"
                                        />
                                        <div className="flex-1 text-xs">
                                            <p className="text-slate-800 font-medium">{item.product?.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                            <p className="text-gray-500">Price: ${item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="mb-4 text-xs space-y-1 bg-gray-50 p-3 rounded border border-gray-100">
                            <p><span className="font-medium text-gray-700">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                            <p><span className="font-medium text-gray-700">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}</p>
                            {selectedOrder.isCouponUsed && (
                                <p><span className="font-medium text-gray-700">Coupon:</span> {selectedOrder.coupon?.code} ({selectedOrder.coupon?.discount}% off)</p>
                            )}
                            <p><span className="font-medium text-gray-700">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded hover:bg-slate-300">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}