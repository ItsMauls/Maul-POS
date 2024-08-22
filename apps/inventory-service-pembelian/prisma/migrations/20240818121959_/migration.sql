/*
  Warnings:

  - You are about to drop the column `id_supplier` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nama]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nama` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FakturPembelian" DROP CONSTRAINT "FakturPembelian_id_supplier_fkey";

-- DropForeignKey
ALTER TABLE "SuratPesanan" DROP CONSTRAINT "SuratPesanan_id_supplier_fkey";

-- DropIndex
DROP INDEX "Supplier_id_supplier_key";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "id_supplier",
ADD COLUMN     "nama" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_nama_key" ON "Supplier"("nama");

-- AddForeignKey
ALTER TABLE "SuratPesanan" ADD CONSTRAINT "SuratPesanan_id_fkey" FOREIGN KEY ("id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakturPembelian" ADD CONSTRAINT "FakturPembelian_id_fkey" FOREIGN KEY ("id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
