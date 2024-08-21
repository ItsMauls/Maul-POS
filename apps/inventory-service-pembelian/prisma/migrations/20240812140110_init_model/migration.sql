/*
  Warnings:

  - You are about to drop the `penerimaan_cabang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `penerimaan_supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "penerimaan_cabang" DROP CONSTRAINT "penerimaan_cabang_kd_cab_fkey";

-- DropForeignKey
ALTER TABLE "penerimaan_supplier" DROP CONSTRAINT "penerimaan_supplier_kd_brgdg_fkey";

-- DropTable
DROP TABLE "penerimaan_cabang";

-- DropTable
DROP TABLE "penerimaan_supplier";

-- DropTable
DROP TABLE "supplier";

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "kd_brgdg" TEXT NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "kd_cab" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenerimaanCabang" (
    "id" SERIAL NOT NULL,
    "idpo" TEXT NOT NULL,
    "kd_cab" TEXT NOT NULL,
    "kd_brgdg" TEXT NOT NULL,
    "psn" INTEGER NOT NULL,
    "isi" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "hna" DECIMAL(10,2) NOT NULL,
    "disc" DECIMAL(5,2) NOT NULL,
    "hna_min_disc" DECIMAL(10,2) NOT NULL,
    "ppn" DECIMAL(5,2) NOT NULL,
    "hna_plus_ppn" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "no_batch" TEXT NOT NULL,
    "tgl_expired" TIMESTAMP(3) NOT NULL,
    "qty_bonus" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenerimaanCabang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenerimaanSupplier" (
    "id" SERIAL NOT NULL,
    "id_po" TEXT NOT NULL,
    "detail" TEXT,
    "tgl_po" TIMESTAMP(3) NOT NULL,
    "kd_brgdg" TEXT NOT NULL,
    "nm_brgdg" TEXT NOT NULL,
    "id_dept" INTEGER NOT NULL,
    "isi_pak" INTEGER NOT NULL,
    "pesanan_outlet" INTEGER NOT NULL,
    "pesan_sup" INTEGER NOT NULL,
    "ket" TEXT,
    "no_sup" TEXT NOT NULL,
    "nm_sup" TEXT NOT NULL,
    "disc" DECIMAL(10,2) NOT NULL,
    "no_sp" TEXT NOT NULL,
    "tgl_sp" TIMESTAMP(3) NOT NULL,
    "user_id_pesan" INTEGER NOT NULL,
    "tgl_input_pesan" TIMESTAMP(3) NOT NULL,
    "datang" INTEGER NOT NULL,
    "tgl_datang" TIMESTAMP(3),
    "user_id_datang" INTEGER,
    "tgl_input_datang" TIMESTAMP(3),
    "status" INTEGER NOT NULL,
    "id_htransb" TEXT NOT NULL,
    "cito" BOOLEAN NOT NULL,
    "q_exp" INTEGER NOT NULL,
    "pesan_box" INTEGER NOT NULL,
    "max_pesan" INTEGER NOT NULL,
    "q_retur" INTEGER NOT NULL,
    "ket_retur" TEXT,
    "panggil" BOOLEAN NOT NULL,
    "bidding" BOOLEAN NOT NULL,
    "jenis_pesanan" TEXT NOT NULL,
    "disc_off" DECIMAL(10,2) NOT NULL,
    "tot_disc_off" DECIMAL(10,2) NOT NULL,
    "tot_disc_off_fin" DECIMAL(10,2) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "pernah_bidding" BOOLEAN NOT NULL,
    "wso2transfer" BOOLEAN NOT NULL,
    "sudah_terima" BOOLEAN NOT NULL,
    "hb_gross_erp" DECIMAL(10,2) NOT NULL,
    "hb_gross_sql" DECIMAL(10,2) NOT NULL,
    "value_sql" DECIMAL(10,2) NOT NULL,
    "value_erp" DECIMAL(10,2) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenerimaanSupplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuratPesanan" (
    "id" SERIAL NOT NULL,
    "nomor_sp" TEXT NOT NULL,
    "tgl_pr" TIMESTAMP(3) NOT NULL,
    "jns_trans" TEXT NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "keterangan" TEXT,
    "userId" INTEGER NOT NULL,
    "status_approval" TEXT NOT NULL,
    "tgl_approve" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuratPesanan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penerimaan" (
    "id" SERIAL NOT NULL,
    "nomor_sp" TEXT NOT NULL,
    "nomor_preorder" TEXT NOT NULL,
    "tgl_preorder" TIMESTAMP(3) NOT NULL,
    "scan" TEXT,
    "jns_trans" TEXT NOT NULL,
    "no_reff" TEXT NOT NULL,
    "tgl_reff" TIMESTAMP(3) NOT NULL,
    "nama_supplier" TEXT NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "keterangan" TEXT,
    "tanggal_jt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "status_approval" TEXT NOT NULL,
    "tgl_approve" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Penerimaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FakturPembelian" (
    "id" SERIAL NOT NULL,
    "nomor_pembelian" TEXT NOT NULL,
    "jns_trans" TEXT NOT NULL,
    "no_reff" TEXT NOT NULL,
    "tgl_reff" TIMESTAMP(3) NOT NULL,
    "id_supplier" INTEGER NOT NULL,
    "sub_total" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "keterangan" TEXT,
    "tanggal_jt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "status_bayar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FakturPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ETicket" (
    "id" SERIAL NOT NULL,
    "no_lpb" TEXT NOT NULL,
    "jenis_transaksi" TEXT NOT NULL,
    "tgl_lpb" TIMESTAMP(3) NOT NULL,
    "polos" BOOLEAN NOT NULL,
    "no_reff" TEXT NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "keterangan" TEXT,
    "userId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ETicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_kd_brgdg_key" ON "Supplier"("kd_brgdg");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_id_supplier_key" ON "Supplier"("id_supplier");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_kd_cab_key" ON "Supplier"("kd_cab");

-- CreateIndex
CREATE UNIQUE INDEX "SuratPesanan_nomor_sp_key" ON "SuratPesanan"("nomor_sp");

-- CreateIndex
CREATE UNIQUE INDEX "FakturPembelian_nomor_pembelian_key" ON "FakturPembelian"("nomor_pembelian");

-- CreateIndex
CREATE UNIQUE INDEX "ETicket_no_lpb_key" ON "ETicket"("no_lpb");

-- AddForeignKey
ALTER TABLE "PenerimaanCabang" ADD CONSTRAINT "PenerimaanCabang_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "Supplier"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenerimaanSupplier" ADD CONSTRAINT "PenerimaanSupplier_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "Supplier"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuratPesanan" ADD CONSTRAINT "SuratPesanan_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id_supplier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penerimaan" ADD CONSTRAINT "Penerimaan_nomor_sp_fkey" FOREIGN KEY ("nomor_sp") REFERENCES "SuratPesanan"("nomor_sp") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakturPembelian" ADD CONSTRAINT "FakturPembelian_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "Supplier"("id_supplier") ON DELETE RESTRICT ON UPDATE CASCADE;
