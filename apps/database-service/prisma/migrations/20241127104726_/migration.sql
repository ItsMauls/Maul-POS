-- CreateTable
CREATE TABLE "mkategori" (
    "id_kategori" SERIAL NOT NULL,
    "nm_kategori" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mkategori_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "mcabang" (
    "kd_cab" TEXT NOT NULL,
    "nm_cab" VARCHAR(100) NOT NULL,
    "alamat" TEXT,
    "no_telepon" VARCHAR(20),
    "no_hp" VARCHAR(20),
    "email" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "id_tipe_cabang" INTEGER,
    "id_area" INTEGER,
    "shift" INTEGER,
    "id_instansi" INTEGER,
    "bpjs" BOOLEAN NOT NULL DEFAULT false,
    "status_connection" BOOLEAN NOT NULL DEFAULT true,
    "offline" BOOLEAN NOT NULL DEFAULT false,
    "proses" BOOLEAN NOT NULL DEFAULT false,
    "tanggal_update" DATE,
    "time_off" TIME,

    CONSTRAINT "mcabang_pkey" PRIMARY KEY ("kd_cab")
);

-- CreateTable
CREATE TABLE "tmainstock" (
    "kd_brgdg" SERIAL NOT NULL,
    "nm_brgdg" TEXT NOT NULL,
    "id_dept" INTEGER,
    "isi" INTEGER,
    "strip" INTEGER NOT NULL,
    "mark_up" DOUBLE PRECISION,
    "hb_netto" DOUBLE PRECISION,
    "hb_gross" DOUBLE PRECISION,
    "hj_ecer" DOUBLE PRECISION,
    "hj_bbs" DOUBLE PRECISION,
    "id_kategori" INTEGER,
    "id_pabrik" INTEGER,
    "barcode" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "hpp" DOUBLE PRECISION,
    "q_bbs" INTEGER,
    "tgl_new_product" TIMESTAMP(3),
    "konsinyasi" BOOLEAN,
    "halodoc" BOOLEAN,
    "bpjs" BOOLEAN,
    "informasi_po" TEXT,
    "informasi_tanggal_ed_po" TIMESTAMP(3),
    "aturan_pakai" TEXT,
    "komposisi" TEXT,
    "indikasi" TEXT,
    "dosis" TEXT,
    "trading_term" TEXT,
    "id_kl" INTEGER,
    "status" INTEGER,
    "moq" INTEGER,
    "min_bulan_ed" INTEGER,
    "informasi_return" TEXT,
    "barcode_big" TEXT,
    "hb_net" DOUBLE PRECISION,
    "mark_up_purchasing" DOUBLE PRECISION,
    "hna" DOUBLE PRECISION,
    "hj_masiva" DOUBLE PRECISION,
    "sup1" TEXT,
    "q_temp_out" INTEGER,
    "q_exp" INTEGER,
    "disc1" DOUBLE PRECISION,
    "q_akhir" INTEGER,
    "produksi" TEXT,
    "het" DOUBLE PRECISION,
    "berat" DOUBLE PRECISION,
    "nie" TEXT,
    "tgl_berlaku_nie" TIMESTAMP(3),
    "file_nie" TEXT,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "id_brand" INTEGER,
    "deskripsi" TEXT,
    "wso2transfer" BOOLEAN,
    "is_updated" BOOLEAN,
    "kd_cab" TEXT NOT NULL,

    CONSTRAINT "tmainstock_pkey" PRIMARY KEY ("kd_brgdg")
);

-- CreateIndex
CREATE UNIQUE INDEX "mkategori_nm_kategori_key" ON "mkategori"("nm_kategori");

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "mkategori"("id_kategori") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "mcabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;
