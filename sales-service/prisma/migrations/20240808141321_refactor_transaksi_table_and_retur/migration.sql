/*
  Warnings:

  - You are about to drop the column `id_hretur` on the `ReturPenjualan` table. All the data in the column will be lost.
  - You are about to drop the `TransaksiPenjualan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_transaksi` to the `ReturPenjualan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReturPenjualan" DROP CONSTRAINT "ReturPenjualan_id_htransb_fkey";

-- AlterTable
ALTER TABLE "ReturPenjualan" DROP COLUMN "id_hretur",
ADD COLUMN     "id_transaksi" INTEGER NOT NULL;

-- DropTable
DROP TABLE "TransaksiPenjualan";

-- CreateTable
CREATE TABLE "Pelanggan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "no_telp" TEXT,
    "usia" INTEGER,
    "instansi" TEXT,
    "korp" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokter" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "spesialisasi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dokter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaksi" (
    "id" SERIAL NOT NULL,
    "id_pelanggan" INTEGER NOT NULL,
    "id_dokter" INTEGER NOT NULL,
    "sales_pelayan" TEXT NOT NULL,
    "jenis_penjualan" TEXT NOT NULL,
    "invoice_eksternal" TEXT,
    "catatan" TEXT,
    "total_harga" DECIMAL(12,2) NOT NULL,
    "total_disc" DECIMAL(12,2) NOT NULL,
    "total_sc_misc" DECIMAL(12,2) NOT NULL,
    "total_promo" DECIMAL(12,2) NOT NULL,
    "total_up" DECIMAL(12,2) NOT NULL,
    "no_voucher" TEXT,
    "interval_transaksi" INTEGER,
    "buffer_transaksi" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransaksiDetail" (
    "id" SERIAL NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "kd_brgdg" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "qty" INTEGER NOT NULL,
    "subjumlah" DECIMAL(12,2) NOT NULL,
    "disc" DECIMAL(10,2) NOT NULL,
    "sc_misc" DECIMAL(10,2) NOT NULL,
    "promo" DECIMAL(10,2) NOT NULL,
    "disc_promo" DECIMAL(10,2) NOT NULL,
    "up" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransaksiDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "Pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "Dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiDetail" ADD CONSTRAINT "TransaksiDetail_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "Transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiDetail" ADD CONSTRAINT "TransaksiDetail_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "Mainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturPenjualan" ADD CONSTRAINT "ReturPenjualan_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "Transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
