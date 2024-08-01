-- CreateTable
CREATE TABLE "supplier" (
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

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerimaan_cabang" (
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

    CONSTRAINT "penerimaan_cabang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penerimaan_supplier" (
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

    CONSTRAINT "penerimaan_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplier_kd_brgdg_key" ON "supplier"("kd_brgdg");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_kd_cab_key" ON "supplier"("kd_cab");

-- AddForeignKey
ALTER TABLE "penerimaan_cabang" ADD CONSTRAINT "penerimaan_cabang_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "supplier"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penerimaan_supplier" ADD CONSTRAINT "penerimaan_supplier_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "supplier"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;
