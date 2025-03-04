-- CreateTable
CREATE TABLE "muser_cabang" (
    "id" BIGSERIAL NOT NULL,
    "user_id" TEXT,
    "kd_cab" VARCHAR(10),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3),
    "updated_by" INTEGER,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "muser_cabang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id" ON "muser_cabang"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "kd_cab" ON "muser_cabang"("kd_cab");

-- AddForeignKey
ALTER TABLE "muser_cabang" ADD CONSTRAINT "muser_cabang_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muser_cabang" ADD CONSTRAINT "muser_cabang_kd_cab_fkey" FOREIGN KEY ("kd_cab") REFERENCES "mcabang"("kd_cab") ON DELETE SET NULL ON UPDATE CASCADE;
