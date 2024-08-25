"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const prisma_1 = __importDefault(require("../src/config/prisma"));
async function seedTransaksiPenjualan() {
    const transaksiPenjualanData = Array.from({ length: 50 }, () => ({
        kd_brgdg: faker_1.faker.string.alphanumeric(6).toUpperCase(),
        nm_brgdg: faker_1.faker.commerce.productName(),
        id_dept: faker_1.faker.number.int({ min: 1, max: 10 }),
        psn: faker_1.faker.number.int({ min: 10, max: 1000 }),
        pisi: faker_1.faker.number.int({ min: 1, max: 100 }),
        ktr: faker_1.faker.helpers.arrayElement(['Obat Umum', 'Obat Resep', 'Alat Kesehatan', 'Suplemen']),
        sat_psn: faker_1.faker.number.int({ min: 1, max: 5 }),
        sld: faker_1.faker.number.int({ min: 0, max: 10000 }),
        nilaipo: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        trana: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        tranb: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        trana_r: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        tranb_r: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        q_akhir: faker_1.faker.number.int({ min: 0, max: 1000 }),
        user_id: faker_1.faker.number.int({ min: 1, max: 100 }),
        tgl_input: faker_1.faker.date.past(),
        hb_gross: faker_1.faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
        isi: faker_1.faker.number.int({ min: 1, max: 1000 }),
        status: faker_1.faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']),
        cito: faker_1.faker.datatype.boolean(),
        buffer: faker_1.faker.number.int({ min: 10, max: 200 }),
        sat_cab: faker_1.faker.number.int({ min: 1, max: 5 }),
        interval_transaksi: faker_1.faker.number.int({ min: 1, max: 30 }),
        rata_rata_qty_jual: faker_1.faker.number.float({ min: 1, max: 100, precision: 0.01 }),
        katagori: faker_1.faker.helpers.arrayElement(['Obat', 'Alat Kesehatan', 'Suplemen', 'Kosmetik']),
        tot_psn: faker_1.faker.number.int({ min: 10, max: 1000 }),
        pesan: faker_1.faker.number.int({ min: 10, max: 1000 }),
        psn_kalkulasi: faker_1.faker.number.int({ min: 10, max: 1000 }),
        qty_po: faker_1.faker.number.int({ min: 10, max: 1000 }),
        qty_beli: faker_1.faker.number.int({ min: 10, max: 1000 }),
        qty_kurang: faker_1.faker.number.int({ min: 0, max: 100 }),
        jumlah_po: faker_1.faker.number.int({ min: 1, max: 10 }),
        nilai_max: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        tranc: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        tranc_r: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        buffer_max: faker_1.faker.number.int({ min: 50, max: 500 }),
        tot_max: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        depo: `Depo ${faker_1.faker.string.alpha({ length: 1, casing: 'upper' })}`,
        q_bbs: faker_1.faker.number.int({ min: 100, max: 10000 }),
        jml_trans: faker_1.faker.number.int({ min: 1, max: 100 }),
        jenis: faker_1.faker.helpers.arrayElement(['Reguler', 'Promo', 'Seasonal']),
        trand: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        trand_r: faker_1.faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
        sat_pus: faker_1.faker.number.int({ min: 1, max: 5 }),
        grade: faker_1.faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
        t1: faker_1.faker.number.int({ min: 1, max: 90 }),
        t2: faker_1.faker.number.int({ min: 1, max: 90 }),
        hna: faker_1.faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
        min_max: faker_1.faker.number.int({ min: 50, max: 1000 }),
        kd_cab: `CAB${faker_1.faker.string.numeric(3)}`,
        hpp: faker_1.faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
        infor: faker_1.faker.lorem.sentence(),
    }));
    const createdTransaksiPenjualan = await prisma_1.default.transaksiPenjualan.createMany({
        data: transaksiPenjualanData,
        skipDuplicates: true,
    });
    console.log(`Seeded ${createdTransaksiPenjualan.count} TransaksiPenjualan records`);
    return createdTransaksiPenjualan.count;
}
async function seedReturPenjualan(transaksiPenjualanCount) {
    const returPenjualanData = Array.from({ length: 50 }, () => ({
        id_hretur: faker_1.faker.number.int({ min: 1000, max: 9999 }),
        detail: faker_1.faker.helpers.maybe(() => faker_1.faker.lorem.sentence()),
        kd_brgdg: faker_1.faker.string.alphanumeric(10),
        qty: faker_1.faker.number.int({ min: 1, max: 100 }),
        harga: parseFloat(faker_1.faker.finance.amount(10, 1000, 2)),
        discount: parseFloat(faker_1.faker.finance.amount(0, 100, 2)),
        ppn: parseFloat(faker_1.faker.finance.amount(0, 50, 2)),
        subtotal_harga: parseFloat(faker_1.faker.finance.amount(100, 10000, 2)),
        subtotal_discount: parseFloat(faker_1.faker.finance.amount(0, 1000, 2)),
        subtotal_ppn: parseFloat(faker_1.faker.finance.amount(0, 500, 2)),
        no_batch: faker_1.faker.helpers.maybe(() => faker_1.faker.string.alphanumeric(8)),
        tgl_batch: faker_1.faker.helpers.maybe(() => faker_1.faker.date.past()),
        id_hretur_cabang: faker_1.faker.helpers.maybe(() => faker_1.faker.number.int({ min: 1000, max: 9999 })),
        detail_retur_cabang: faker_1.faker.helpers.maybe(() => faker_1.faker.lorem.sentence()),
        status_retur: faker_1.faker.helpers.arrayElement(['Diproses', 'Selesai', 'Ditolak']),
        nominal_retur: faker_1.faker.helpers.maybe(() => parseFloat(faker_1.faker.finance.amount(100, 10000, 2))),
        hpp: parseFloat(faker_1.faker.finance.amount(50, 500, 2)),
        total_hpp: parseFloat(faker_1.faker.finance.amount(500, 5000, 2)),
        wso2transfer: faker_1.faker.datatype.boolean(),
        id_htransb: faker_1.faker.number.int({ min: 1, max: transaksiPenjualanCount }),
    }));
    const createdReturPenjualan = await prisma_1.default.returPenjualan.createMany({
        data: returPenjualanData,
        skipDuplicates: true,
    });
    console.log(`Seeded ${createdReturPenjualan.count} ReturPenjualan records`);
}
const pharmaceuticalNames = [
    'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Omeprazole', 'Metformin',
    'Amlodipine', 'Simvastatin', 'Losartan', 'Metoprolol', 'Sertraline',
    'Gabapentin', 'Levothyroxine', 'Escitalopram', 'Atorvastatin', 'Lisinopril',
    'Albuterol', 'Metformin', 'Hydrocodone', 'Pantoprazole', 'Citalopram',
    'Fluoxetine', 'Metoprolol', 'Amlodipine', 'Hydrochlorothiazide', 'Metformin'
];
async function seedMainstock(categoryCount) {
    const mainstockData = Array.from({ length: 500 }, () => ({
        nm_brgdg: faker_1.faker.helpers.arrayElement(pharmaceuticalNames) + ' ' + faker_1.faker.number.int({ min: 50, max: 1000 }) + 'mg',
        id_dept: faker_1.faker.number.int({ min: 1, max: 10 }),
        isi: faker_1.faker.number.int({ min: 10, max: 100 }),
        id_satuan: faker_1.faker.number.int({ min: 1, max: 5 }),
        strip: faker_1.faker.number.int({ min: 1, max: 20 }),
        mark_up: faker_1.faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        hb_netto: faker_1.faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
        hb_gross: faker_1.faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
        hj_ecer: faker_1.faker.number.float({ min: 1500, max: 150000, precision: 0.01 }),
        hj_bbs: faker_1.faker.number.float({ min: 1200, max: 120000, precision: 0.01 }),
        id_kategori: faker_1.faker.number.int({ min: 1, max: categoryCount }),
        id_pabrik: faker_1.faker.number.int({ min: 1, max: 50 }),
        barcode: faker_1.faker.string.numeric(13),
        created_by: faker_1.faker.internet.userName(),
        hpp: faker_1.faker.number.float({ min: 800, max: 80000, precision: 0.01 }),
        q_bbs: faker_1.faker.number.int({ min: 0, max: 1000 }),
        sat_pus: faker_1.faker.number.int({ min: 1, max: 5 }),
        sat_cab: faker_1.faker.number.int({ min: 1, max: 5 }),
        tgl_new_product: faker_1.faker.date.past(),
        konsinyasi: faker_1.faker.datatype.boolean(),
        halodoc: faker_1.faker.datatype.boolean(),
        bpjs: faker_1.faker.datatype.boolean(),
        informasi_po: faker_1.faker.helpers.maybe(() => faker_1.faker.lorem.sentence()),
        informasi_tanggal_ed_po: faker_1.faker.helpers.maybe(() => faker_1.faker.date.future()),
        id_dept_pusdis: faker_1.faker.number.int({ min: 1, max: 10 }),
        trading_term: faker_1.faker.helpers.maybe(() => faker_1.faker.lorem.word()),
        id_kl: faker_1.faker.number.int({ min: 1, max: 100 }),
        status: faker_1.faker.number.int({ min: 0, max: 3 }),
        moq: faker_1.faker.number.int({ min: 1, max: 100 }),
        min_bulan_ed: faker_1.faker.number.int({ min: 1, max: 36 }),
        informasi_return: faker_1.faker.helpers.maybe(() => faker_1.faker.lorem.sentence()),
        barcode_big: faker_1.faker.helpers.maybe(() => faker_1.faker.string.numeric(14)),
        hb_net: faker_1.faker.number.float({ min: 900, max: 90000, precision: 0.01 }),
        mark_up_purchasing: faker_1.faker.number.float({ min: 0.05, max: 0.3, precision: 0.01 }),
        hna: faker_1.faker.number.float({ min: 1100, max: 110000, precision: 0.01 }),
        hj_masiva: faker_1.faker.number.float({ min: 1300, max: 130000, precision: 0.01 }),
        sup1: faker_1.faker.helpers.maybe(() => faker_1.faker.company.name()),
        q_temp_out: faker_1.faker.number.int({ min: 0, max: 500 }),
        q_exp: faker_1.faker.number.int({ min: 0, max: 100 }),
        disc1: faker_1.faker.number.float({ min: 0, max: 0.3, precision: 0.01 }),
        q_akhir: faker_1.faker.number.int({ min: 0, max: 1000 }),
        produksi: faker_1.faker.helpers.maybe(() => faker_1.faker.date.past().toISOString().split('T')[0]),
        het: faker_1.faker.number.float({ min: 1400, max: 140000, precision: 0.01 }),
        berat: faker_1.faker.number.float({ min: 0.1, max: 5, precision: 0.1 }),
        nie: faker_1.faker.helpers.maybe(() => faker_1.faker.string.alphanumeric(15)),
        tgl_berlaku_nie: faker_1.faker.helpers.maybe(() => faker_1.faker.date.future()),
        file_nie: faker_1.faker.helpers.maybe(() => faker_1.faker.system.filePath()),
        updated_at: faker_1.faker.helpers.maybe(() => faker_1.faker.date.recent()),
        updated_by: faker_1.faker.helpers.maybe(() => faker_1.faker.internet.userName()),
        id_brand: faker_1.faker.number.int({ min: 1, max: 50 }),
        wso2transfer: faker_1.faker.datatype.boolean(),
        is_updated: faker_1.faker.datatype.boolean(),
    }));
    const createdMainstock = await prisma_1.default.mainstock.createMany({
        data: mainstockData,
        skipDuplicates: true,
    });
    console.log(`Seeded ${createdMainstock.count} Mainstock records`);
}
const categories = [
    { name: 'OTC (Over-the-Counter)', description: 'Obat yang dapat dibeli tanpa resep dokter' },
    { name: 'Ethical', description: 'Obat yang hanya dapat dibeli dengan resep dokter' },
    { name: 'Alat Kesehatan', description: 'Peralatan medis dan kesehatan' },
    { name: 'Vitamin / Mineral & Multivitamin', description: 'Suplemen untuk kesehatan' },
    { name: 'Skin Care Series', description: 'Produk perawatan kulit' },
    { name: 'Herbal & Tradisional', description: 'Obat-obatan berbasis tanaman dan tradisional' },
    { name: 'Nutrisi', description: 'Produk untuk kebutuhan nutrisi khusus' },
    { name: 'Antibiotik', description: 'Obat untuk melawan infeksi bakteri' },
    { name: 'Analgesik', description: 'Obat pereda nyeri' },
    { name: 'Antipiretik', description: 'Obat penurun demam' },
    { name: 'Antidiabetik', description: 'Obat untuk mengelola diabetes' },
    { name: 'Antihipertensi', description: 'Obat untuk tekanan darah tinggi' },
    { name: 'Antihistamin', description: 'Obat untuk mengatasi alergi' },
    { name: 'Antiseptik & Desinfektan', description: 'Produk pembersih dan sterilisasi' },
    { name: 'Obat Mata', description: 'Produk untuk kesehatan mata' },
];
async function seedCategories() {
    const createdCategories = await prisma_1.default.kategori.createMany({
        data: categories,
        skipDuplicates: true,
    });
    console.log(`Seeded ${createdCategories.count} Category records`);
    return createdCategories.count;
}
async function main() {
    try {
        const categoryCount = await seedCategories();
        await seedMainstock(categoryCount);
        const transaksiPenjualanCount = await seedTransaksiPenjualan();
        await seedReturPenjualan(transaksiPenjualanCount);
        console.log('Seeding completed successfully');
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
