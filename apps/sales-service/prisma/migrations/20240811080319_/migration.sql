-- DropForeignKey
ALTER TABLE "Mainstock" DROP CONSTRAINT "Mainstock_id_kategori_fkey";

-- AlterTable
ALTER TABLE "Mainstock" ALTER COLUMN "id_kategori" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Mainstock" ADD CONSTRAINT "Mainstock_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "Kategori"("id") ON DELETE SET NULL ON UPDATE CASCADE;
