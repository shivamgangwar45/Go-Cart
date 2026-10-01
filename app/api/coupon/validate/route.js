import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { code, cartAmount } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Please enter a coupon code' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Database se coupon fetch karein
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid coupon code' }, { status: 400 });
    }

    // 2. Expiry check fix: Aaj ke din ke end tak (23:59:59) valid maanein
    if (coupon.expiresAt) {
      const expiry = new Date(coupon.expiresAt);
      // Day ka end set karein taaki selected date ke din expire na ho
      expiry.setHours(23, 59, 59, 999);

      if (expiry < new Date()) {
        return NextResponse.json({ success: false, message: 'This coupon has expired' }, { status: 400 });
      }
    }

    // 3. Discount calculate karein
    const total = parseFloat(cartAmount || 0);
    const discountPercent = parseFloat(coupon.discount || 0);
    const discountAmount = Math.round((total * discountPercent) / 100);

    return NextResponse.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        discount: discountPercent,
        discountAmount,
        description: coupon.description,
      },
    });

  } catch (error) {
    console.error("Coupon Validate Error:", error);
    return NextResponse.json({ success: false, message: 'Error validating coupon' }, { status: 500 });
  }
}