/*
  Warnings:

  - Made the column `strip` on table `Mainstock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mainstock" ALTER COLUMN "isi" DROP NOT NULL,
ALTER COLUMN "strip" SET NOT NULL;
