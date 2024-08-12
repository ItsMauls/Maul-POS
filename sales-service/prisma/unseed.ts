import prisma from '../src/config/prisma';
import './loadEnv';

async function unseed() {
  try {
    // Delete data from tables in reverse order of dependencies
    await prisma.returPenjualan.deleteMany();
    await prisma.transaksiDetail.deleteMany();
    await prisma.transaksi.deleteMany();
    await prisma.mainstock.deleteMany();
    await prisma.dokter.deleteMany();
    await prisma.pelanggan.deleteMany();
    await prisma.kategori.deleteMany();

    // Reset auto-increment for existing tables
    await prisma.$executeRaw`ALTER SEQUENCE "ReturPenjualan_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "TransaksiDetail_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Transaksi_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Mainstock_kd_brgdg_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Dokter_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Pelanggan_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Kategori_id_seq" RESTART WITH 1`;

    console.log('All seeded data has been removed and IDs reset');
  } catch (error) {
    console.error('Error removing seeded data:', error);
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'P2003') {
        console.error('Foreign key constraint failed. Make sure to delete related records first.');
      } else if (error.code === 'P2000') {
        console.error('Invalid value provided. Check your data types.');
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

unseed();