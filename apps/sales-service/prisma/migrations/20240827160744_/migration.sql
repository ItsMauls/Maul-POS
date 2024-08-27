-- CreateTable
CREATE TABLE "Antrian" (
    "id_antrian" SERIAL NOT NULL,
    "id_trans" INTEGER,
    "no_antrian" INTEGER,
    "type_trans" TEXT,
    "mulai" TEXT,
    "selesai" TEXT,
    "timer" TEXT,
    "status_proses" INTEGER,
    "user_mulai" TEXT,
    "user_selesai" TEXT,
    "tgl_update" TIMESTAMP(3),
    "status" TEXT,
    "status_antrian" BOOLEAN,
    "tanggal" TIMESTAMP(3),
    "status_racik" BOOLEAN,
    "kd_cab" TEXT NOT NULL,
    "id_pelanggan" INTEGER,

    CONSTRAINT "Antrian_pkey" PRIMARY KEY ("id_antrian")
);

-- AddForeignKey
ALTER TABLE "Antrian" ADD CONSTRAINT "Antrian_id_trans_fkey" FOREIGN KEY ("id_trans") REFERENCES "Transaksi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antrian" ADD CONSTRAINT "Antrian_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "Cabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Antrian" ADD CONSTRAINT "Antrian_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "Pelanggan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
