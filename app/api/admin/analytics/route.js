import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Prisma ke through check karein ki data kisme hai
    const [products, orders, stores, users] = await Promise.all([
      prisma.product ? prisma.product.findMany({ select: { id: true, name: true, price: true } }) : [],
      prisma.order ? prisma.order.findMany() : [],
      prisma.store ? prisma.store.findMany() : [],
      prisma.user ? prisma.user.count() : 0,
    ]);

    console.log("--- DB DIAGNOSTICS ---");
    console.log("Products found in DB:", products.length);
    console.log("Orders found in DB:", orders.length);
    console.log("Stores found in DB:", stores.length);
    if (orders.length > 0) {
      console.log("Sample Order Fields:", Object.keys(orders[0]));
    }

    // Revenue calculate karte waqt field check karein (total vs amount vs grandTotal)
    const totalRevenue = orders.reduce((sum, o) => {
      const val = o.total ?? o.amount ?? o.totalAmount ?? o.price ?? 0;
      return sum + Number(val);
    }, 0);

    return NextResponse.json({
      success: true,
      debug: {
        productsInDB: products.length,
        ordersInDB: orders.length,
        storesInDB: stores.length,
        usersInDB: users,
      },
      stats: {
        totalProducts: products.length,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        totalStores: stores.length,
      },
      products: products.length,
      revenue: Number(totalRevenue.toFixed(2)),
      orders: orders.length,
      stores: stores.length,
      allOrders: orders,
      chartData: orders.map((o) => ({
        date: new Date(o.createdAt).toISOString().split('T')[0],
        orders: 1,
      })),
    });
  } catch (error) {
    console.error("Analytics Route Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}