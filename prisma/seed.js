const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data to Neon PostgreSQL...');

  // 1. User
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: `usr_${Date.now()}`,
        name: 'Shivam Gangwar',
        email: 'admin@gocart.com',
        image: '',
      },
    });
    console.log('Created User:', user.name);
  }

  // 2. Store (with required 'contact' and 'address')
  let store = await prisma.store.findFirst();
  if (!store) {
    store = await prisma.store.create({
      data: {
        userId: user.id,
        name: 'GoCart Official Store',
        description: 'Prime Electronics & Accessories',
        username: `gocart_${Date.now().toString().slice(-4)}`,
        address: 'Station Road, Civil Lines, Bareilly, UP',
        contact: '9876543210', // 🔥 Fixed: contact field added
        email: 'store@gocart.com',
        logo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200',
        status: 'APPROVED',
      },
    });
    console.log('Created Store:', store.name);
  }

  // 3. Delivery Address
  let address = await prisma.address.findFirst({ where: { userId: user.id } });
  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: user.id,
        name: user.name || 'Shivam Gangwar',
        email: user.email || 'admin@gocart.com',
        street: 'Civil Lines, Station Road',
        city: 'Bareilly',
        state: 'Uttar Pradesh',
        zip: '243001',
        country: 'India',
      },
    });
    console.log('Created Delivery Address');
  }

  // 4. Products
  const existingProducts = await prisma.product.count();
  if (existingProducts === 0) {
    const productsList = [
      { name: 'Wireless Studio Headphones', price: 2999, mrp: 3999, category: 'ELECTRONICS' },
      { name: 'Ergonomic Wooden Chair', price: 4500, mrp: 5999, category: 'FURNITURE' },
      { name: 'Smart Fitness Band Pro', price: 1899, mrp: 2499, category: 'ELECTRONICS' },
      { name: 'Brass Vintage Table Lamp', price: 1200, mrp: 1600, category: 'LIGHTING' },
    ];

    for (const p of productsList) {
      await prisma.product.create({
        data: {
          storeId: store.id,
          name: p.name,
          description: `${p.name} - high quality premium finish`,
          mrp: p.mrp,
          price: p.price,
          category: p.category,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
          stock: 25,
        },
      });
    }
    console.log('Created 4 Products');
  }

  // 5. Orders (Last 5 Days with realistic timeline)
  const today = new Date();
  const sampleAmounts = [1200, 2999, 4500, 1899, 7499];

  for (let i = 0; i < sampleAmounts.length; i++) {
    const orderDate = new Date();
    orderDate.setDate(today.getDate() - (4 - i));

    await prisma.order.create({
      data: {
        total: sampleAmounts[i],
        status: i === 4 ? 'ORDER_PLACED' : 'DELIVERED',
        userId: user.id,
        storeId: store.id,
        addressId: address.id,
        createdAt: orderDate,
      },
    });
  }

  console.log('Successfully created 5 Orders with graph history!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });