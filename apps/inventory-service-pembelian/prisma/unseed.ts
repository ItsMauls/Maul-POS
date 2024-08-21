import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all records from all tables
  await prisma.eTicket.deleteMany();
  await prisma.fakturPembelian.deleteMany();
  await prisma.penerimaan.deleteMany();
  await prisma.suratPesanan.deleteMany();
  await prisma.penerimaanSupplier.deleteMany();
  await prisma.penerimaanCabang.deleteMany();
  await prisma.supplier.deleteMany();

  console.log('All records have been deleted.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });