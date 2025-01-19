-- CreateTable
CREATE TABLE "retur_penjualan" (
    "id" SERIAL NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "kd_brgdg" INTEGER NOT NULL,
    "detail" TEXT,
    "qty" INTEGER NOT NULL,
    "harga" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "ppn" DECIMAL(10,2) NOT NULL,
    "subtotal_harga" DECIMAL(12,2) NOT NULL,
    "subtotal_discount" DECIMAL(12,2) NOT NULL,
    "subtotal_ppn" DECIMAL(12,2) NOT NULL,
    "no_batch" TEXT,
    "tgl_batch" TIMESTAMP(3),
    "id_hretur_cabang" INTEGER,
    "detail_retur_cabang" TEXT,
    "status_retur" TEXT,
    "nominal_retur" DECIMAL(12,2),
    "hpp" DECIMAL(10,2) NOT NULL,
    "total_hpp" DECIMAL(12,2) NOT NULL,
    "wso2transfer" BOOLEAN NOT NULL,
    "id_htransb" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "retur_penjualan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "retur_penjualan" ADD CONSTRAINT "retur_penjualan_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retur_penjualan" ADD CONSTRAINT "retur_penjualan_kd_brgdg_fkey" FOREIGN KEY ("kd_brgdg") REFERENCES "tmainstock"("kd_brgdg") ON DELETE RESTRICT ON UPDATE CASCADE;
