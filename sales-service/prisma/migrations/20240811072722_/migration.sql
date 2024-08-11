/*
  Warnings:

  - You are about to drop the column `sat_cab` on the `Mainstock` table. All the data in the column will be lost.
  - You are about to drop the column `sat_pus` on the `Mainstock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mainstock" DROP COLUMN "sat_cab",
DROP COLUMN "sat_pus",
ALTER COLUMN "mark_up" DROP NOT NULL,
ALTER COLUMN "hb_netto" DROP NOT NULL,
ALTER COLUMN "hb_gross" DROP NOT NULL,
ALTER COLUMN "hj_ecer" DROP NOT NULL,
ALTER COLUMN "hj_bbs" DROP NOT NULL,
ALTER COLUMN "id_pabrik" DROP NOT NULL,
ALTER COLUMN "barcode" DROP NOT NULL,
ALTER COLUMN "created_by" DROP NOT NULL,
ALTER COLUMN "hpp" DROP NOT NULL,
ALTER COLUMN "q_bbs" DROP NOT NULL,
ALTER COLUMN "tgl_new_product" DROP NOT NULL,
ALTER COLUMN "konsinyasi" DROP NOT NULL,
ALTER COLUMN "halodoc" DROP NOT NULL,
ALTER COLUMN "bpjs" DROP NOT NULL,
ALTER COLUMN "id_kl" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "moq" DROP NOT NULL,
ALTER COLUMN "min_bulan_ed" DROP NOT NULL,
ALTER COLUMN "hb_net" DROP NOT NULL,
ALTER COLUMN "mark_up_purchasing" DROP NOT NULL,
ALTER COLUMN "hna" DROP NOT NULL,
ALTER COLUMN "hj_masiva" DROP NOT NULL,
ALTER COLUMN "q_temp_out" DROP NOT NULL,
ALTER COLUMN "q_exp" DROP NOT NULL,
ALTER COLUMN "disc1" DROP NOT NULL,
ALTER COLUMN "q_akhir" DROP NOT NULL,
ALTER COLUMN "het" DROP NOT NULL,
ALTER COLUMN "berat" DROP NOT NULL,
ALTER COLUMN "id_brand" DROP NOT NULL,
ALTER COLUMN "wso2transfer" DROP NOT NULL,
ALTER COLUMN "is_updated" DROP NOT NULL;
