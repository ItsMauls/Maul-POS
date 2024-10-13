/*
  Warnings:

  - You are about to drop the column `mainstockId` on the `Promo` table. All the data in the column will be lost.
  - You are about to drop the `Mainstock` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `tmainstockId` to the `Promo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mainstock" DROP CONSTRAINT "Mainstock_id_kategori_fkey";

-- DropForeignKey
ALTER TABLE "Mainstock" DROP CONSTRAINT "Mainstock_kd_cab_fkey";

-- DropForeignKey
ALTER TABLE "Promo" DROP CONSTRAINT "Promo_mainstockId_fkey";

-- DropForeignKey
ALTER TABLE "ReturPenjualan" DROP CONSTRAINT "ReturPenjualan_kd_brgdg_fkey";

-- DropForeignKey
ALTER TABLE "TransaksiDetail" DROP CONSTRAINT "TransaksiDetail_kd_brgdg_fkey";

-- AlterTable
ALTER TABLE "Promo" DROP COLUMN "mainstockId",
ADD COLUMN     "tmainstockId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Mainstock";

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

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "Kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "Cabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransaksiDetail" ADD CONSTRAINT "TransaksiDetail_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "tmainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturPenjualan" ADD CONSTRAINT "ReturPenjualan_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "tmainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promo" ADD CONSTRAINT "Promo_tmainstockId_fkey" FOREIGN KEY ("tmainstockId") REFERENCES "tmainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;
