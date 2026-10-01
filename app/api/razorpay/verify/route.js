import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma'; // Make sure aapka prisma client import path theek ho

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: "Missing payment credentials" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ success: false, message: "Server payment configuration error" }, { status: 500 });
    }

    // Generate expected signature
    const hmac = crypto.createHmac('sha256', keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    // Secure timing comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    // Database update (Prisma)
    if (orderId && prisma) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paymentId: razorpay_payment_id,
          status: 'Processing',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id
    }, { status: 200 });

  } catch (error) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ success: false, message: "Server error during payment verification" }, { status: 500 });
  }
}