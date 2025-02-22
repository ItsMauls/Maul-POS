-- DropForeignKey
ALTER TABLE "mkassa" DROP CONSTRAINT "mkassa_kd_cab_fkey";

-- CreateTable
CREATE TABLE "taktifitas_kasir" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(50) NOT NULL,
    "tanggal" DATE,
    "tgl_trans" TIMESTAMP(3),
    "kd_kasir" INTEGER,
    "shift" VARCHAR(1),
    "tanggal_opening" DATE,
    "jam_opening" TIME(0),
    "tanggal_closing" DATE,
    "jam_closing" TIME(0),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taktifitas_kasir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "taktifitas_kasir_kode_key" ON "taktifitas_kasir"("kode");

-- AddForeignKey
ALTER TABLE "mkassa" ADD CONSTRAINT "mkassa_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "mcabang"("kd_cab") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taktifitas_kasir" ADD CONSTRAINT "taktifitas_kasir_kd_kasir_fkey" FOREIGN KEY ("kd_kasir") REFERENCES "mkassa"("id") ON DELETE SET NULL ON UPDATE CASCADE;
