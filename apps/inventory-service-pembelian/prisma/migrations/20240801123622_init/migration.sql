/*
  Warnings:

  - A unique constraint covering the columns `[kd_brgdg]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kd_cab]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "supplier_kd_brgdg_key" ON "supplier"("kd_brgdg");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_kd_cab_key" ON "supplier"("kd_cab");

-- AddForeignKey
ALTER TABLE "penerimaan_cabang" ADD CONSTRAINT "penerimaan_cabang_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "supplier"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerimaan_supplier" ADD CONSTRAINT "penerimaan_supplier_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "supplier"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;
