/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mainstock" DROP CONSTRAINT "Mainstock_id_kategori_fkey";

-- DropTable
DROP TABLE "Category";

-- CreateTable
CREATE TABLE "Kategori" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_name_key" ON "Kategori"("name");

-- AddForeignKey
ALTER TABLE "Mainstock" ADD CONSTRAINT "Mainstock_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
