import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 1. GET ALL COUPONS
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("GET Coupon Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch coupons" }, { status: 500 });
  }
}

// 2. CREATE COUPON
export async function POST(req) {
  try {
    const body = await req.json();
    const { code, description, discount, forNewUser, forMember, expiresAt } = body;

    if (!code || discount === undefined || discount === '') {
      return NextResponse.json({ success: false, message: "Code and discount are required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "Coupon code already exists!" }, { status: 400 });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: description || '',
        discount: parseFloat(discount),
        forNewUser: Boolean(forNewUser),
        forMember: Boolean(forMember),
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, coupon: newCoupon }, { status: 201 });
  } catch (error) {
    console.error("POST Coupon Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to create coupon" }, { status: 500 });
  }
}

// 3. EDIT / UPDATE COUPON (Primary Key Safe Handler)
export async function PUT(req) {
  try {
    const body = await req.json();
    const { originalCode, code, description, discount, forNewUser, forMember, expiresAt } = body;

    const oldCode = (originalCode || code)?.trim().toUpperCase();
    const newCode = code?.trim().toUpperCase();

    if (!oldCode) {
      return NextResponse.json({ success: false, message: "Original coupon code is required" }, { status: 400 });
    }

    // Check agar purana record exist karta hai
    const existing = await prisma.coupon.findUnique({
      where: { code: oldCode },
    });

    if (!existing) {
      return NextResponse.json({ success: false, message: "Coupon not found in database" }, { status: 404 });
    }

    let updatedCoupon;

    // CASE 1: User ne Code change kiya hai (Prisma cannot update PK, so delete & recreate in 1 atomic transaction)
    if (newCode && newCode !== oldCode) {
      const duplicateCheck = await prisma.coupon.findUnique({
        where: { code: newCode },
      });

      if (duplicateCheck) {
        return NextResponse.json({ success: false, message: `Code '${newCode}' is already taken!` }, { status: 400 });
      }

      updatedCoupon = await prisma.$transaction(async (tx) => {
        await tx.coupon.delete({
          where: { code: oldCode },
        });

        return await tx.coupon.create({
          data: {
            code: newCode,
            description: description !== undefined ? description : existing.description,
            discount: discount !== undefined ? parseFloat(discount) : existing.discount,
            forNewUser: forNewUser !== undefined ? Boolean(forNewUser) : existing.forNewUser,
            forMember: forMember !== undefined ? Boolean(forMember) : existing.forMember,
            expiresAt: expiresAt ? new Date(expiresAt) : existing.expiresAt,
          },
        });
      });
    } 
    // CASE 2: Code wahi hai, sirf discount, description ya date change hui hai
    else {
      updatedCoupon = await prisma.coupon.update({
        where: { code: oldCode },
        data: {
          description: description !== undefined ? description : existing.description,
          discount: discount !== undefined ? parseFloat(discount) : existing.discount,
          forNewUser: forNewUser !== undefined ? Boolean(forNewUser) : existing.forNewUser,
          forMember: forMember !== undefined ? Boolean(forMember) : existing.forMember,
          expiresAt: expiresAt ? new Date(expiresAt) : existing.expiresAt,
        },
      });
    }

    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error) {
    console.error("PUT Coupon Error Details:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to update coupon" }, { status: 500 });
  }
}

// 4. DELETE COUPON
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ success: false, message: "Code parameter is required" }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { code: code.trim().toUpperCase() },
    });

    return NextResponse.json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("DELETE Coupon Error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete coupon" }, { status: 500 });
  }
}