-- DropForeignKey
ALTER TABLE "penerimaan_cabang" DROP CONSTRAINT "penerimaan_cabang_kd_cab_fkey";

-- DropForeignKey
ALTER TABLE "penerimaan_supplier" DROP CONSTRAINT "penerimaan_supplier_kd_brgdg_fkey";

-- DropIndex
DROP INDEX "supplier_kd_brgdg_key";

-- DropIndex
DROP INDEX "supplier_kd_cab_key";
