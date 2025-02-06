/*
  Warnings:

  - You are about to drop the column `no_bon` on the `keranjang` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_antrian]` on the table `keranjang` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_antrian` to the `keranjang` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "keranjang_no_bon_key";

-- AlterTable
ALTER TABLE "keranjang" DROP COLUMN "no_bon",
ADD COLUMN     "id_antrian" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "keranjang_id_antrian_key" ON "keranjang"("id_antrian");

-- AddForeignKey
ALTER TABLE "keranjang" ADD CONSTRAINT "keranjang_id_antrian_fkey" FOREIGN KEY ("id_antrian") REFERENCES "antrian"("id_antrian") ON DELETE RESTRICT ON UPDATE CASCADE;
