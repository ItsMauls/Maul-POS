-- CreateTable
CREATE TABLE "promo" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "diskon" DOUBLE PRECISION NOT NULL,
    "tanggal_awal" TIMESTAMP(3) NOT NULL,
    "tanggal_akhir" TIMESTAMP(3) NOT NULL,
    "jam_awal_promo" TEXT NOT NULL,
    "jam_akhir_promo" TEXT NOT NULL,
    "no_promo" TEXT NOT NULL,
    "jenis_promo" TEXT NOT NULL,
    "min_pembelian" INTEGER,
    "max_diskon" DOUBLE PRECISION,
    "kuantitas_beli" INTEGER,
    "kuantitas_gratis" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "tmainstockId" INTEGER NOT NULL,

    CONSTRAINT "promo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TransaksiDetailPromos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TransaksiDetailPromos_AB_unique" ON "_TransaksiDetailPromos"("A", "B");

-- CreateIndex
CREATE INDEX "_TransaksiDetailPromos_B_index" ON "_TransaksiDetailPromos"("B");

-- AddForeignKey
ALTER TABLE "promo" ADD CONSTRAINT "promo_tmainstockId_fkey" FOREIGN KEY ("tmainstockId") REFERENCES "tmainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransaksiDetailPromos" ADD CONSTRAINT "_TransaksiDetailPromos_A_fkey" FOREIGN KEY ("A") REFERENCES "promo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransaksiDetailPromos" ADD CONSTRAINT "_TransaksiDetailPromos_B_fkey" FOREIGN KEY ("B") REFERENCES "transaksi_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
