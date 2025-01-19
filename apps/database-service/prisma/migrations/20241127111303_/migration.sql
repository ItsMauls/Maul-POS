-- AlterTable
ALTER TABLE "tmainstock" ADD COLUMN     "id_satuan" INTEGER;

-- CreateTable
CREATE TABLE "msatuan" (
    "id_satuan" SERIAL NOT NULL,
    "nm_satuan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "msatuan_pkey" PRIMARY KEY ("id_satuan")
);

-- CreateIndex
CREATE UNIQUE INDEX "msatuan_nm_satuan_key" ON "msatuan"("nm_satuan");

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_id_satuan_fkey" FOREIGN KEY ("id_satuan") REFERENCES "msatuan"("id_satuan") ON DELETE SET NULL ON UPDATE CASCADE;
