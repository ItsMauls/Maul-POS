/*
  Warnings:

  - Changed the type of `kd_brgdg` on the `ReturPenjualan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ReturPenjualan" DROP COLUMN "kd_brgdg",
ADD COLUMN     "kd_brgdg" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ReturPenjualan" ADD CONSTRAINT "ReturPenjualan_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "Mainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;
