/*
  Warnings:

  - Added the required column `kd_cab` to the `Mainstock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kd_cab` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mainstock" ADD COLUMN     "kd_cab" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "kd_cab" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Cabang" (
    "id" SERIAL NOT NULL,
    "kd_cab" TEXT NOT NULL,
    "nama_cabang" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cabang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cabang_kd_cab_key" ON "Cabang"("kd_cab");

-- AddForeignKey
ALTER TABLE "Mainstock" ADD CONSTRAINT "Mainstock_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "Cabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaksi" ADD CONSTRAINT "Transaksi_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "Cabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;
