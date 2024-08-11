/*
  Warnings:

  - You are about to drop the column `id_dept_pusdis` on the `Mainstock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mainstock" DROP COLUMN "id_dept_pusdis",
ADD COLUMN     "aturan_pakai" TEXT,
ADD COLUMN     "indikasi" TEXT,
ADD COLUMN     "komposisi" TEXT;
