import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function unseed() {
  try {
    console.log('Starting database cleanup...');

    // Hapus data dan reset sequences
    await prisma.$executeRaw`TRUNCATE TABLE "tmainstock" RESTART IDENTITY CASCADE`;
    console.log('Cleaned MainStock records');

    await prisma.$executeRaw`TRUNCATE TABLE "mrack_pusdis" RESTART IDENTITY CASCADE`;
    console.log('Cleaned RackPusdis records');

    await prisma.$executeRaw`TRUNCATE TABLE "mkl_produk" RESTART IDENTITY CASCADE`;
    console.log('Cleaned KLProduk records');

    await prisma.$executeRaw`TRUNCATE TABLE "mpabrik" RESTART IDENTITY CASCADE`;
    console.log('Cleaned Pabrik records');

    await prisma.$executeRaw`TRUNCATE TABLE "mcabang" RESTART IDENTITY CASCADE`;
    console.log('Cleaned Cabang records');

    await prisma.$executeRaw`TRUNCATE TABLE "msatuan" RESTART IDENTITY CASCADE`;
    console.log('Cleaned Satuan records');

    await prisma.$executeRaw`TRUNCATE TABLE "mkategori" RESTART IDENTITY CASCADE`;
    console.log('Cleaned Kategori records');

    console.log('Database cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

unseed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
