import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email & password required" }, { status: 400 });
    }

    // 1. Secret Admin Credentials Check (UI par dikhega nahi)
    if (email === 'admin@gocart.com' && password === 'admin123') {
      const adminToken = jwt.sign(
        { id: 'admin_root', email, role: 'admin', name: 'GoCart Administrator' },
        process.env.JWT_SECRET || 'gocart_super_secret_jwt_key',
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        success: true,
        message: "Admin authentication successful",
        role: 'admin',
        token: adminToken,
        user: {
          id: 'admin_root',
          name: 'GoCart Admin',
          email: 'admin@gocart.com',
          role: 'admin'
        }
      }, { status: 200 });
    }

    // 2. Normal Customer Login Flow
    let user = null;
    if (prisma) {
      user = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'customer', name: user.name },
      process.env.JWT_SECRET || 'gocart_super_secret_jwt_key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      role: 'customer',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'customer'
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login Route Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}