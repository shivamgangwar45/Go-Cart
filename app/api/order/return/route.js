import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { orderId, reason, details } = await req.json();

    if (!orderId || !reason) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'Return Requested',
      },
    });

    return NextResponse.json({
      success: true,
      message: "Return request recorded",
      order: updatedOrder,
    }, { status: 200 });

  } catch (error) {
    console.error("Return API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}