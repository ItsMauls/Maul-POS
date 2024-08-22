-- DropForeignKey
ALTER TABLE "FakturPembelian" DROP CONSTRAINT "FakturPembelian_id_fkey";

-- DropForeignKey
ALTER TABLE "SuratPesanan" DROP CONSTRAINT "SuratPesanan_id_fkey";

-- AddForeignKey
ALTER TABLE "SuratPesanan" ADD CONSTRAINT "SuratPesanan_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakturPembelian" ADD CONSTRAINT "FakturPembelian_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
