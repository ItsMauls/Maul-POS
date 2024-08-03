import prisma from '../src/config/prisma';

async function unseed() {
  try {
    // Hapus data dari tabel-tabel dalam urutan terbalik dari dependensi
    await prisma.returPenjualan.deleteMany();
    await prisma.transaksiPenjualan.deleteMany();
    await prisma.mainstock.deleteMany();
    await prisma.kategori.deleteMany();

    // Reset auto-increment for existing tables
    await prisma.$executeRaw`ALTER SEQUENCE "ReturPenjualan_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "TransaksiPenjualan_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Mainstock_kd_brgdg_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Kategori_id_seq" RESTART WITH 1`;

    console.log('All seeded data has been removed and IDs reset');
  } catch (error) {
    console.error('Error removing seeded data:', error);
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      console.error('Foreign key constraint failed. Make sure to delete related records first.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

unseed();