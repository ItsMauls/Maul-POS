/*
  Warnings:

  - The primary key for the `mainstock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `kd_brgdg` column on the `mainstock` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "mainstock" DROP CONSTRAINT "mainstock_pkey",
DROP COLUMN "kd_brgdg",
ADD COLUMN     "kd_brgdg" SERIAL NOT NULL,
ADD CONSTRAINT "mainstock_pkey" PRIMARY KEY ("kd_brgdg");
