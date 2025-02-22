-- CreateTable
CREATE TABLE "mkassa" (
    "id" SERIAL NOT NULL,
    "no_kassa" TEXT NOT NULL,
    "mac_address" TEXT NOT NULL,
    "type_jual" TEXT NOT NULL,
    "status_antrian" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "default_printer" TEXT,
    "status_operasional" BOOLEAN NOT NULL DEFAULT true,
    "user_operasional" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "kd_cab" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mkassa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mkassa_no_kassa_key" ON "mkassa"("no_kassa");

-- AddForeignKey
ALTER TABLE "mkassa" ADD CONSTRAINT "mkassa_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "mcabang"("kd_cab") ON DELETE RESTRICT ON UPDATE CASCADE;
