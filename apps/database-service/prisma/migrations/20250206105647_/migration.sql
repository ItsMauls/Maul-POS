/*
  Warnings:

  - You are about to drop the column `id_transaksi` on the `keranjang` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "keranjang" DROP CONSTRAINT "keranjang_id_transaksi_fkey";

-- DropIndex
DROP INDEX "keranjang_id_transaksi_key";

-- AlterTable
ALTER TABLE "keranjang" DROP COLUMN "id_transaksi";
