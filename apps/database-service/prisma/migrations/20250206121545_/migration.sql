/*
  Warnings:

  - Added the required column `total_disc` to the `keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_harga` to the `keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_promo` to the `keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_sc_misc` to the `keranjang` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_up` to the `keranjang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "keranjang" ADD COLUMN     "no_voucher" TEXT,
ADD COLUMN     "total_disc" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "total_harga" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "total_promo" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "total_sc_misc" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "total_up" DECIMAL(12,2) NOT NULL;
