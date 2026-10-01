import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Ek Real Verified User ensure karein
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: `usr_${Date.now()}`,
          name: 'Shivam Gangwar',
          email: 'shivam@gocart.com',
          image: '',
        },
      });
    }

    // 2. Ek Real Store ensure karein
    let store = await prisma.store.findFirst();
    if (!store) {
      store = await prisma.store.create({
        data: {
          userId: user.id,
          name: 'GoCart Official Store',
          description: 'Official flagship electronics and accessories store.',
          username: `gocart_store_${Date.now().toString().slice(-4)}`,
          status: 'APPROVED',
        },
      });
    }

    // 3. Ek Real Delivery Address ensure karein
    let address = await prisma.address.findFirst({
      where: { userId: user.id },
    });
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: user.id,
          name: user.name || 'Shivam Gangwar',
          email: user.email || 'shivam@gocart.com',
          phone: '9876543210',
          street: 'Civil Lines, Station Road',
          city: 'Bareilly',
          state: 'Uttar Pradesh',
          zip: '243001',
          country: 'India',
        },
      });
    }

    // 4. Ek Real Product ensure karein
    let product = await prisma.product.findFirst({
      where: { storeId: store.id },
    });
    if (!product) {
      product = await prisma.product.create({
        data: {
          storeId: store.id,
          name: 'GoCart Pro Wireless Headphones',
          description: 'Noise-cancelling high-fidelity Bluetooth studio headphones.',
          mrp: 2999.00,
          price: 2499.00,
          category: 'ELECTRONICS',
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
          stock: 45,
        },
      });
    }

    // 5. Ek Live Real Order Create Karein
    const orderTotal = product.price || 2499.00;
    const newOrder = await prisma.order.create({
      data: {
        total: parseFloat(orderTotal),
        status: 'ORDER_PLACED',
        isPaid: true,
        paymentMethod: 'Razorpay',
        userId: user.id,
        storeId: store.id,
        addressId: address.id,
        orderItems: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              price: parseFloat(orderTotal),
            },
          ],
        },
        orderTimeline: {
          create: [
            {
              status: 'ORDER_PLACED',
              title: 'Order Placed',
              description: 'Customer confirmed the order via Razorpay Checkout.',
            },
          ],
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Real Store & Order created in Neon DB successfully!',
      orderId: newOrder.id,
      storeName: store.name,
      total: newOrder.total,
    });
  } catch (error) {
    console.error('Create Test Order Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create real test order',
      },
      { status: 500 }
    );
  }
}