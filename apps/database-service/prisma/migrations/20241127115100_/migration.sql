-- CreateTable
CREATE TABLE "mrack_pusdis" (
    "id_dept_pusdis" SERIAL NOT NULL,
    "nm_dept" TEXT NOT NULL,
    "id_kategori" INTEGER,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "nm_kategori" TEXT,

    CONSTRAINT "mrack_pusdis_pkey" PRIMARY KEY ("id_dept_pusdis")
);

-- AddForeignKey
ALTER TABLE "mrack_pusdis" ADD CONSTRAINT "mrack_pusdis_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "mrack_pusdis"("id_dept_pusdis") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mrack_pusdis" ADD CONSTRAINT "mrack_pusdis_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "mkategori"("id_kategori") ON DELETE SET NULL ON UPDATE CASCADE;
