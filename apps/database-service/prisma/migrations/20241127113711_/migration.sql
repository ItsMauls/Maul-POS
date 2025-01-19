-- CreateTable
CREATE TABLE "mkl_produk" (
    "id_kl" SERIAL NOT NULL,
    "nm_kl" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mkl_produk_pkey" PRIMARY KEY ("id_kl")
);

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_id_kl_fkey" FOREIGN KEY ("id_kl") REFERENCES "mkl_produk"("id_kl") ON DELETE SET NULL ON UPDATE CASCADE;
