const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Laptop', price: 999.99, stock: 5 },
        { name: 'Phone', price: 599.99, stock: 8 },
        { name: 'Headphones', price: 129.99, stock: 15 },
      ],
    });
  }
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });


