import { faker } from '@faker-js/faker';
import prisma from '../src/config/prisma';

async function seedTransaksiPenjualan() {
  const transaksiPenjualanData = Array.from({ length: 50 }, () => ({
    kd_brgdg: faker.string.alphanumeric(6).toUpperCase(),
    nm_brgdg: faker.commerce.productName(),
    id_dept: faker.number.int({ min: 1, max: 10 }),
    psn: faker.number.int({ min: 10, max: 1000 }),
    pisi: faker.number.int({ min: 1, max: 100 }),
    ktr: faker.helpers.arrayElement(['Obat Umum', 'Obat Resep', 'Alat Kesehatan', 'Suplemen']),
    sat_psn: faker.number.int({ min: 1, max: 5 }),
    sld: faker.number.int({ min: 0, max: 10000 }),
    nilaipo: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    trana: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    tranb: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    trana_r: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    tranb_r: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    q_akhir: faker.number.int({ min: 0, max: 1000 }),
    user_id: faker.number.int({ min: 1, max: 100 }),
    tgl_input: faker.date.past(),
    hb_gross: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    isi: faker.number.int({ min: 1, max: 1000 }),
    status: faker.helpers.arrayElement(['Active', 'Inactive', 'Pending']),
    cito: faker.datatype.boolean(),
    buffer: faker.number.int({ min: 10, max: 200 }),
    sat_cab: faker.number.int({ min: 1, max: 5 }),
    interval_transaksi: faker.number.int({ min: 1, max: 30 }),
    rata_rata_qty_jual: faker.number.float({ min: 1, max: 100, precision: 0.01 }),
    katagori: faker.helpers.arrayElement(['Obat', 'Alat Kesehatan', 'Suplemen', 'Kosmetik']),
    tot_psn: faker.number.int({ min: 10, max: 1000 }),
    pesan: faker.number.int({ min: 10, max: 1000 }),
    psn_kalkulasi: faker.number.int({ min: 10, max: 1000 }),
    qty_po: faker.number.int({ min: 10, max: 1000 }),
    qty_beli: faker.number.int({ min: 10, max: 1000 }),
    qty_kurang: faker.number.int({ min: 0, max: 100 }),
    jumlah_po: faker.number.int({ min: 1, max: 10 }),
    nilai_max: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    tranc: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    tranc_r: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    buffer_max: faker.number.int({ min: 50, max: 500 }),
    tot_max: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    depo: `Depo ${faker.string.alpha({ length: 1, casing: 'upper' })}`,
    q_bbs: faker.number.int({ min: 100, max: 10000 }),
    jml_trans: faker.number.int({ min: 1, max: 100 }),
    jenis: faker.helpers.arrayElement(['Reguler', 'Promo', 'Seasonal']),
    trand: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    trand_r: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
    sat_pus: faker.number.int({ min: 1, max: 5 }),
    grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
    t1: faker.number.int({ min: 1, max: 90 }),
    t2: faker.number.int({ min: 1, max: 90 }),
    hna: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    min_max: faker.number.int({ min: 50, max: 1000 }),
    kd_cab: `CAB${faker.string.numeric(3)}`,
    hpp: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    infor: faker.lorem.sentence(),
  }));

  const createdTransaksiPenjualan = await prisma.transaksiPenjualan.createMany({
    data: transaksiPenjualanData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdTransaksiPenjualan.count} TransaksiPenjualan records`);
  return createdTransaksiPenjualan.count;
}

async function seedReturPenjualan(transaksiPenjualanCount: number) {
  const returPenjualanData = Array.from({ length: 50 }, () => ({
    id_hretur: faker.number.int({ min: 1000, max: 9999 }),
    detail: faker.helpers.maybe(() => faker.lorem.sentence()),
    kd_brgdg: faker.string.alphanumeric(10),
    qty: faker.number.int({ min: 1, max: 100 }),
    harga: parseFloat(faker.finance.amount(10, 1000, 2)),
    discount: parseFloat(faker.finance.amount(0, 100, 2)),
    ppn: parseFloat(faker.finance.amount(0, 50, 2)),
    subtotal_harga: parseFloat(faker.finance.amount(100, 10000, 2)),
    subtotal_discount: parseFloat(faker.finance.amount(0, 1000, 2)),
    subtotal_ppn: parseFloat(faker.finance.amount(0, 500, 2)),
    no_batch: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
    tgl_batch: faker.helpers.maybe(() => faker.date.past()),
    id_hretur_cabang: faker.helpers.maybe(() => faker.number.int({ min: 1000, max: 9999 })),
    detail_retur_cabang: faker.helpers.maybe(() => faker.lorem.sentence()),
    status_retur: faker.helpers.arrayElement(['Diproses', 'Selesai', 'Ditolak']),
    nominal_retur: faker.helpers.maybe(() => parseFloat(faker.finance.amount(100, 10000, 2))),
    hpp: parseFloat(faker.finance.amount(50, 500, 2)),
    total_hpp: parseFloat(faker.finance.amount(500, 5000, 2)),
    wso2transfer: faker.datatype.boolean(),
    id_htransb: faker.number.int({ min: 1, max: transaksiPenjualanCount }),
  }));

  const createdReturPenjualan = await prisma.returPenjualan.createMany({
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

async function seedMainstock(categoryCount: number) {
  const mainstockData = Array.from({ length: 500 }, () => ({
    nm_brgdg: faker.helpers.arrayElement(pharmaceuticalNames) + ' ' + faker.number.int({ min: 50, max: 1000 }) + 'mg',
    id_dept: faker.number.int({ min: 1, max: 10 }),
    isi: faker.number.int({ min: 10, max: 100 }),
    id_satuan: faker.number.int({ min: 1, max: 5 }),
    strip: faker.number.int({ min: 1, max: 20 }),
    mark_up: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
    hb_netto: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    hb_gross: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    hj_ecer: faker.number.float({ min: 1500, max: 150000, precision: 0.01 }),
    hj_bbs: faker.number.float({ min: 1200, max: 120000, precision: 0.01 }),
    id_kategori: faker.number.int({ min: 1, max: categoryCount }),
    id_pabrik: faker.number.int({ min: 1, max: 50 }),
    barcode: faker.string.numeric(13),
    created_by: faker.internet.userName(),
    hpp: faker.number.float({ min: 800, max: 80000, precision: 0.01 }),
    q_bbs: faker.number.int({ min: 0, max: 1000 }),
    sat_pus: faker.number.int({ min: 1, max: 5 }),
    sat_cab: faker.number.int({ min: 1, max: 5 }),
    tgl_new_product: faker.date.past(),
    konsinyasi: faker.datatype.boolean(),
    halodoc: faker.datatype.boolean(),
    bpjs: faker.datatype.boolean(),
    informasi_po: faker.helpers.maybe(() => faker.lorem.sentence()),
    informasi_tanggal_ed_po: faker.helpers.maybe(() => faker.date.future()),
    id_dept_pusdis: faker.number.int({ min: 1, max: 10 }),
    trading_term: faker.helpers.maybe(() => faker.lorem.word()),
    id_kl: faker.number.int({ min: 1, max: 100 }),
    status: faker.number.int({ min: 0, max: 3 }),
    moq: faker.number.int({ min: 1, max: 100 }),
    min_bulan_ed: faker.number.int({ min: 1, max: 36 }),
    informasi_return: faker.helpers.maybe(() => faker.lorem.sentence()),
    barcode_big: faker.helpers.maybe(() => faker.string.numeric(14)),
    hb_net: faker.number.float({ min: 900, max: 90000, precision: 0.01 }),
    mark_up_purchasing: faker.number.float({ min: 0.05, max: 0.3, precision: 0.01 }),
    hna: faker.number.float({ min: 1100, max: 110000, precision: 0.01 }),
    hj_masiva: faker.number.float({ min: 1300, max: 130000, precision: 0.01 }),
    sup1: faker.helpers.maybe(() => faker.company.name()),
    q_temp_out: faker.number.int({ min: 0, max: 500 }),
    q_exp: faker.number.int({ min: 0, max: 100 }),
    disc1: faker.number.float({ min: 0, max: 0.3, precision: 0.01 }),
    q_akhir: faker.number.int({ min: 0, max: 1000 }),
    produksi: faker.helpers.maybe(() => faker.date.past().toISOString().split('T')[0]),
    het: faker.number.float({ min: 1400, max: 140000, precision: 0.01 }),
    berat: faker.number.float({ min: 0.1, max: 5, precision: 0.1 }),
    nie: faker.helpers.maybe(() => faker.string.alphanumeric(15)),
    tgl_berlaku_nie: faker.helpers.maybe(() => faker.date.future()),
    file_nie: faker.helpers.maybe(() => faker.system.filePath()),
    updated_at: faker.helpers.maybe(() => faker.date.recent()),
    updated_by: faker.helpers.maybe(() => faker.internet.userName()),
    id_brand: faker.number.int({ min: 1, max: 50 }),
    wso2transfer: faker.datatype.boolean(),
    is_updated: faker.datatype.boolean(),    
  }));

  const createdMainstock = await prisma.mainstock.createMany({
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
const createdCategories = await prisma.kategori.createMany({
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
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });