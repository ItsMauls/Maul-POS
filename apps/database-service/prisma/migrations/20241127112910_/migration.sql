-- CreateTable
CREATE TABLE "mpabrik" (
    "id" SERIAL NOT NULL,
    "nm_pabrik" TEXT NOT NULL,
    "alamat" TEXT,
    "no_telepon" VARCHAR(20),
    "email" VARCHAR(100),
    "no_npwp" VARCHAR(50),
    "nm_npwp" TEXT,
    "alamat_npwp" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "min_bulan_ed" INTEGER,
    "informasi_retur" TEXT,
    "prf_telp" VARCHAR(20),

    CONSTRAINT "mpabrik_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_id_pabrik_fkey" FOREIGN KEY ("id_pabrik") REFERENCES "mpabrik"("id") ON DELETE SET NULL ON UPDATE CASCADE;
