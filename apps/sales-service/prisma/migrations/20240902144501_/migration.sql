-- CreateTable
CREATE TABLE "Promo" (
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
    "mainstockId" INTEGER NOT NULL,

    CONSTRAINT "Promo_pkey" PRIMARY KEY ("id")
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
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_mainstockId_fkey" FOREIGN KEY ("mainstockId") REFERENCES "Mainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransaksiDetailPromos" ADD CONSTRAINT "_TransaksiDetailPromos_A_fkey" FOREIGN KEY ("A") REFERENCES "Promo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransaksiDetailPromos" ADD CONSTRAINT "_TransaksiDetailPromos_B_fkey" FOREIGN KEY ("B") REFERENCES "TransaksiDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
