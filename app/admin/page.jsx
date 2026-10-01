'use client'

import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, PlusCircle, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminDashboard() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

    const [loading, setLoading] = useState(true)
    const [seeding, setSeeding] = useState(false)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
    })

    const dashboardCardsData = [
        { title: 'Total Products', value: dashboardData.products, icon: ShoppingBasketIcon },
        { 
            title: 'Total Revenue', 
            value: `${currency}${Number(dashboardData.revenue || 0).toLocaleString()}`, 
            icon: CircleDollarSignIcon 
        },
        { title: 'Total Orders', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Total Stores', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/admin/analytics', { cache: 'no-store' })
            const data = await res.json()

            if (res.ok && data.success) {
                setDashboardData({
                    products: data.stats?.totalProducts ?? data.products ?? 0,
                    revenue: data.stats?.totalRevenue ?? data.revenue ?? 0,
                    orders: data.stats?.totalOrders ?? data.orders ?? 0,
                    stores: data.stats?.totalStores ?? data.stores ?? 0,
                    allOrders: data.allOrders ?? [],
                })
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSeedData = async () => {
        try {
            setSeeding(true)
            const res = await fetch('/api/admin/create-test-order', { method: 'POST' })
            const data = await res.json()

            if (res.ok && data.success) {
                toast.success('Neon DB me orders successfully create ho gaye!')
                await fetchDashboardData()
            } else {
                toast.error(data.message || 'Data insert fail ho gaya')
            }
        } catch (err) {
            console.error(err)
            toast.error('Network error during seeding')
        } finally {
            setSeeding(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="space-y-6 text-slate-400">
            {/* Header with Generate Button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    Admin <span className="text-[#3b82f6]">Dashboard</span>
                </h1>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#0e1320] border border-slate-800 px-3.5 py-2 rounded-xl transition cursor-pointer"
                        title="Refresh"
                    >
                        <RefreshCw size={13} /> Refresh
                    </button>

                    <button
                        onClick={handleSeedData}
                        disabled={seeding}
                        className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 px-4 py-2 rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
                    >
                        <PlusCircle size={14} /> {seeding ? 'Writing to Neon DB...' : 'Generate Real DB Orders'}
                    </button>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
                {dashboardCardsData.map((card, index) => (
                    <div 
                        key={index} 
                        className="flex items-center justify-between border border-slate-800/90 bg-[#0e1320] p-4 px-6 rounded-2xl shadow-xl hover:border-slate-700 transition"
                    >
                        <div className="flex flex-col gap-2 text-xs">
                            <p className="text-slate-400 font-medium">{card.title}</p>
                            <b className="text-2xl font-bold text-white tracking-tight">{card.value}</b>
                        </div>
                        <div className="size-11 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md shrink-0">
                            <card.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Area Chart Container */}
            <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex justify-end">
                    <span className="text-xs font-bold text-slate-400">
                        Orders <span className="text-slate-600">/ Day</span>
                    </span>
                </div>
                
                {dashboardData.allOrders && dashboardData.allOrders.length > 0 ? (
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                ) : (
                    <div className="h-64 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3">
                        <p className="text-xs text-slate-500">There are zero orders in database.</p>
                        <button
                            onClick={handleSeedData}
                            disabled={seeding}
                            className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition cursor-pointer"
                        >
                            Click to insert test orders into Neon DB
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}