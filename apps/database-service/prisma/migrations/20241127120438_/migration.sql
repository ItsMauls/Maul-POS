-- AlterTable
ALTER TABLE "tmainstock" ADD COLUMN     "id_dept_pusdis" INTEGER;

-- AddForeignKey
ALTER TABLE "tmainstock" ADD CONSTRAINT "tmainstock_id_dept_pusdis_fkey" FOREIGN KEY ("id_dept_pusdis") REFERENCES "mrack_pusdis"("id_dept_pusdis") ON DELETE SET NULL ON UPDATE CASCADE;
