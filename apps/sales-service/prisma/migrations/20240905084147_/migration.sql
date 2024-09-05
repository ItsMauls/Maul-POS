-- AlterTable
ALTER TABLE "Promo" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "kuantitas_beli" INTEGER,
ADD COLUMN     "kuantitas_gratis" INTEGER,
ADD COLUMN     "max_diskon" DOUBLE PRECISION,
ADD COLUMN     "min_pembelian" INTEGER;
