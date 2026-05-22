const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const res = await prisma.product.updateMany({ where: { material: 'Legno' }, data: { material: null } });
  console.log('Updated products:', res.count);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
