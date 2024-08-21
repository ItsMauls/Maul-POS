"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/config/prisma"));
async function unseed() {
    try {
        // Hapus data dari tabel-tabel dalam urutan terbalik dari dependensi
        await prisma_1.default.returPenjualan.deleteMany();
        await prisma_1.default.transaksiPenjualan.deleteMany();
        await prisma_1.default.mainstock.deleteMany();
        await prisma_1.default.kategori.deleteMany();
        // Reset auto-increment for existing tables
        await prisma_1.default.$executeRaw `ALTER SEQUENCE "ReturPenjualan_id_seq" RESTART WITH 1`;
        await prisma_1.default.$executeRaw `ALTER SEQUENCE "TransaksiPenjualan_id_seq" RESTART WITH 1`;
        await prisma_1.default.$executeRaw `ALTER SEQUENCE "Mainstock_kd_brgdg_seq" RESTART WITH 1`;
        await prisma_1.default.$executeRaw `ALTER SEQUENCE "Kategori_id_seq" RESTART WITH 1`;
        console.log('All seeded data has been removed and IDs reset');
    }
    catch (error) {
        console.error('Error removing seeded data:', error);
        if (error instanceof Error && 'code' in error && error.code === 'P2003') {
            console.error('Foreign key constraint failed. Make sure to delete related records first.');
        }
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
unseed();
