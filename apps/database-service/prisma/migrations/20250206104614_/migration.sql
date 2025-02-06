-- CreateTable
CREATE TABLE "keranjang" (
    "id" SERIAL NOT NULL,
    "no_bon" TEXT NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "pelanggan" JSONB,
    "dokter" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "keranjang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keranjang_no_bon_key" ON "keranjang"("no_bon");

-- CreateIndex
CREATE UNIQUE INDEX "keranjang_id_transaksi_key" ON "keranjang"("id_transaksi");

-- AddForeignKey
ALTER TABLE "keranjang" ADD CONSTRAINT "keranjang_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
