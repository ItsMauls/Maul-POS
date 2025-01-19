-- CreateTable
CREATE TABLE "transaksi" (
    "id" SERIAL NOT NULL,
    "id_pelanggan" INTEGER NOT NULL,
    "id_dokter" INTEGER NOT NULL,
    "kd_cab" TEXT NOT NULL,
    "sales_pelayan" TEXT NOT NULL,
    "jenis_penjualan" TEXT NOT NULL,
    "invoice_eksternal" TEXT,
    "catatan" TEXT,
    "total_harga" DECIMAL(12,2) NOT NULL,
    "total_disc" DECIMAL(12,2) NOT NULL,
    "total_sc_misc" DECIMAL(12,2) NOT NULL,
    "total_promo" DECIMAL(12,2) NOT NULL,
    "total_up" DECIMAL(12,2) NOT NULL,
    "no_voucher" TEXT,
    "interval_transaksi" INTEGER,
    "buffer_transaksi" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "receipt" TEXT,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaksi_detail" (
    "id" SERIAL NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "kd_brgdg" INTEGER NOT NULL,
    "jenis" TEXT NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "qty" INTEGER NOT NULL,
    "subjumlah" DECIMAL(12,2) NOT NULL,
    "disc" DECIMAL(10,2) NOT NULL,
    "sc_misc" DECIMAL(10,2) NOT NULL,
    "promo" DECIMAL(10,2) NOT NULL,
    "disc_promo" DECIMAL(10,2) NOT NULL,
    "up" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "antrian" (
    "id_antrian" SERIAL NOT NULL,
    "id_trans" INTEGER,
    "id_pelanggan" INTEGER,
    "kd_cab" TEXT NOT NULL,
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

    CONSTRAINT "antrian_pkey" PRIMARY KEY ("id_antrian")
);

-- CreateTable
CREATE TABLE "pelanggan" (
    "id" SERIAL NOT NULL,
    "nama" TEXT,
    "alamat" TEXT,
    "no_telp" TEXT,
    "usia" INTEGER,
    "instansi" TEXT,
    "korp" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pelanggan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dokter" (
    "id" SERIAL NOT NULL,
    "nama" TEXT,
    "alamat" TEXT,
    "spesialisasi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dokter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "pelanggan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_dokter_fkey" FOREIGN KEY ("id_dokter") REFERENCES "dokter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "mcabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_detail" ADD CONSTRAINT "transaksi_detail_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi_detail" ADD CONSTRAINT "transaksi_detail_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "tmainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian" ADD CONSTRAINT "antrian_id_trans_fkey" FOREIGN KEY ("id_trans") REFERENCES "transaksi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian" ADD CONSTRAINT "antrian_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "mcabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "antrian" ADD CONSTRAINT "antrian_id_pelanggan_fkey" FOREIGN KEY ("id_pelanggan") REFERENCES "pelanggan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
