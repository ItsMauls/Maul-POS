import { faker } from '@faker-js/faker';
import prisma from '../src/config/prisma';
import './loadEnv';
import { CATEGORIES, REAL_DRUG_NAMES } from '../src/constants';

async function seedCategories() {
const createdCategories = await prisma.kategori.createMany({
  data: CATEGORIES,
  skipDuplicates: true,
});

console.log(`Seeded ${createdCategories.count} Category records`);
return createdCategories.count;
}

const generateDrugName = (() => {
  const usedSizes = new Set();
  return () => {
    const drugName = faker.helpers.arrayElement(REAL_DRUG_NAMES);
    let drugSizeInGrams;
    do {
      drugSizeInGrams = Math.floor(Math.random() * 500) + 1; // Ukuran dalam gram (1-500 gram)
    } while (usedSizes.has(drugSizeInGrams));
    usedSizes.add(drugSizeInGrams);
    return `${drugName} ${drugSizeInGrams} gr`;
  };
})();

async function seedCabang() {
  const cabangData = Array.from({ length: 10 }, (_, index) => ({
    kd_cab: `CAB${String(index + 1).padStart(3, '0')}`,
    nama_cabang: faker.company.name(),
    alamat: faker.location.streetAddress(),
    area: faker.location.city(),
  }));

  const createdCabang = await prisma.cabang.createMany({
    data: cabangData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdCabang.count} Cabang records`);
  return createdCabang.count > 0 ? createdCabang.count : 10; // Ensure we return at least 1
}

async function seedMainstock(categoryCount: number, cabangCount: number) {
  const mainstockData = Array.from({ length: 500 }, () => ({
    nm_brgdg: generateDrugName(),
    id_dept: faker.number.int({ min: 1, max: 10 }),
    isi: faker.number.int({ min: 1, max: 100 }),    
    strip: faker.number.int({ min: 1, max: 20 }),
    mark_up: faker.number.float({ min: 0.1, max: 0.5 }),
    hb_netto: faker.number.float({ min: 1000, max: 100000 }),
    hb_gross: faker.number.float({ min: 1000, max: 100000 }),
    hj_ecer: faker.number.float({ min: 1500, max: 150000 }),
    hj_bbs: faker.number.float({ min: 1200, max: 120000 }),
    id_kategori: faker.number.int({ min: 1, max: categoryCount }),
    id_pabrik: faker.number.int({ min: 1, max: 50 }),
    barcode: faker.string.numeric(13),
    created_by: faker.internet.userName(),
    hpp: faker.number.float({ min: 800, max: 80000 }),
    q_bbs: faker.number.int({ min: 0, max: 1000 }),        
    tgl_new_product: faker.date.past(),
    konsinyasi: faker.datatype.boolean(),
    halodoc: faker.datatype.boolean(),
    bpjs: faker.datatype.boolean(),
    informasi_po: faker.lorem.sentence(),
    informasi_tanggal_ed_po: faker.date.future(),    
    trading_term: faker.lorem.word(),
    id_kl: faker.number.int({ min: 1, max: 100 }),
    status: faker.number.int({ min: 0, max: 3 }),
    moq: faker.number.int({ min: 1, max: 100 }),
    min_bulan_ed: faker.number.int({ min: 1, max: 36 }),
    informasi_return: faker.lorem.sentence(),
    barcode_big: faker.string.numeric(14),
    hb_net: faker.number.float({ min: 900, max: 90000 }),
    mark_up_purchasing: faker.number.float({ min: 0.05, max: 0.3 }),
    hna: faker.number.float({ min: 1100, max: 110000 }),
    hj_masiva: faker.number.float({ min: 1300, max: 130000 }),
    sup1: faker.company.name(),
    q_temp_out: faker.number.int({ min: 0, max: 500 }),
    q_exp: faker.number.int({ min: 0, max: 100 }),
    disc1: faker.number.float({ min: 0, max: 0.3 }),
    q_akhir: faker.number.int({ min: 0, max: 1000 }),
    produksi: faker.date.past().toISOString().split('T')[0],
    het: faker.number.float({ min: 1400, max: 140000 }),
    berat: faker.number.float({ min: 0.1, max: 5 }),
    nie: faker.string.alphanumeric(15),
    tgl_berlaku_nie: faker.date.future(),
    file_nie: faker.system.filePath(),
    id_brand: faker.number.int({ min: 1, max: 50 }),
    wso2transfer: faker.datatype.boolean(),
    is_updated: faker.datatype.boolean(),
    kd_cab: `CAB${String(faker.number.int({ min: 1, max: Math.max(1, cabangCount) })).padStart(3, '0')}`,
  }));

  const createdMainstock = await prisma.mainstock.createMany({
    data: mainstockData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdMainstock.count} Mainstock records`);
}

async function seedPelanggan() {
  const pelangganData = Array.from({ length: 50 }, () => ({
    nama: faker.person.fullName(),
    alamat: faker.location.streetAddress(),
    no_telp: faker.phone.number(),
    usia: faker.number.int({ min: 18, max: 80 }),
    instansi: faker.helpers.maybe(() => faker.company.name()),
    korp: faker.helpers.maybe(() => faker.company.buzzPhrase()),
  }));

  const createdPelanggan = await prisma.pelanggan.createMany({
    data: pelangganData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdPelanggan.count} Pelanggan records`);
  return createdPelanggan.count;
}

async function seedDokter() {
  const dokterData = Array.from({ length: 20 }, () => ({
    nama: faker.person.fullName(),
    spesialisasi: faker.helpers.arrayElement(['Umum', 'Anak', 'Penyakit Dalam', 'Bedah', 'Mata', 'THT', 'Kulit dan Kelamin']),
    alamat: faker.location.streetAddress()
  }));

  const createdDokter = await prisma.dokter.createMany({
    data: dokterData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdDokter.count} Dokter records`);
  return createdDokter.count;
}

async function seedTransaksi(pelangganCount: number, dokterCount: number, cabangCount: number) {
  const transaksiData = Array.from({ length: 100 }, () => ({
    id_pelanggan: faker.number.int({ min: 1, max: pelangganCount }),
    id_dokter: faker.number.int({ min: 1, max: dokterCount }),
    sales_pelayan: faker.person.firstName(),
    jenis_penjualan: faker.helpers.arrayElement(['Tunai', 'Kredit', 'Online']),
    invoice_eksternal: faker.helpers.maybe(() => faker.string.alphanumeric(10)),
    catatan: faker.helpers.maybe(() => faker.lorem.sentence()),
    total_harga: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
    total_disc: faker.number.float({ min: 0, max: 100000, precision: 0.01 }),
    total_sc_misc: faker.number.float({ min: 0, max: 50000, precision: 0.01 }),
    total_promo: faker.number.float({ min: 0, max: 100000, precision: 0.01 }),
    total_up: faker.number.float({ min: 0, max: 50000, precision: 0.01 }),
    no_voucher: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
    interval_transaksi: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 30 })),
    buffer_transaksi: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10 })),
    kd_cab: `CAB${String(faker.number.int({ min: 1, max: Math.max(1, cabangCount) })).padStart(3, '0')}`,
  }));

  const createdTransaksi = await prisma.transaksi.createMany({
    data: transaksiData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdTransaksi.count} Transaksi records`);
  return createdTransaksi.count;
}

async function seedTransaksiDetail(transaksiCount: number, mainstockCount: number) {
  const transaksiDetailData = Array.from({ length: 200 }, () => ({
    id_transaksi: faker.number.int({ min: 1, max: transaksiCount }),
    kd_brgdg: faker.number.int({ min: 1, max: mainstockCount }),
    jenis: faker.helpers.arrayElement(['R', 'RC']),
    harga: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    qty: faker.number.int({ min: 1, max: 10 }),
    subjumlah: faker.number.float({ min: 1000, max: 1000000, precision: 0.01 }),
    disc: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    sc_misc: faker.number.float({ min: 0, max: 5000, precision: 0.01 }),
    promo: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    disc_promo: faker.number.float({ min: 0, max: 5000, precision: 0.01 }),
    up: faker.number.float({ min: 0, max: 5000, precision: 0.01 }),
  }));

  const createdTransaksiDetail = await prisma.transaksiDetail.createMany({
    data: transaksiDetailData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdTransaksiDetail.count} TransaksiDetail records`);
}

async function seedReturPenjualan(transaksiCount: number, mainstockCount: number) {
  const returPenjualanData = Array.from({ length: 50 }, () => ({
    id_transaksi: faker.number.int({ min: 1, max: transaksiCount }),
    kd_brgdg: faker.number.int({ min: 1, max: mainstockCount }),
    detail: faker.helpers.maybe(() => faker.lorem.sentence()),
    qty: faker.number.int({ min: 1, max: 10 }),
    harga: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
    discount: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    ppn: faker.number.float({ min: 0, max: 5000, precision: 0.01 }),
    subtotal_harga: faker.number.float({ min: 1000, max: 1000000, precision: 0.01 }),
    subtotal_discount: faker.number.float({ min: 0, max: 100000, precision: 0.01 }),
    subtotal_ppn: faker.number.float({ min: 0, max: 50000, precision: 0.01 }),
    no_batch: faker.helpers.maybe(() => faker.string.alphanumeric(8)),
    tgl_batch: faker.helpers.maybe(() => faker.date.past()),
    id_hretur_cabang: faker.helpers.maybe(() => faker.number.int({ min: 1000, max: 9999 })),
    detail_retur_cabang: faker.helpers.maybe(() => faker.lorem.sentence()),
    status_retur: faker.helpers.arrayElement(['Diproses', 'Selesai', 'Ditolak']),
    nominal_retur: faker.number.float({ min: 1000, max: 1000000, precision: 0.01 }),
    hpp: faker.number.float({ min: 500, max: 50000, precision: 0.01 }),
    total_hpp: faker.number.float({ min: 500, max: 500000, precision: 0.01 }),
    wso2transfer: faker.datatype.boolean(),
    id_htransb: faker.number.int({ min: 1, max: 1000 }),
  }));

  const createdReturPenjualan = await prisma.returPenjualan.createMany({
    data: returPenjualanData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdReturPenjualan.count} ReturPenjualan records`);
}

async function main() {
  try {
    const categoryCount = await seedCategories();
    const cabangCount = await seedCabang();
    await seedMainstock(categoryCount, cabangCount);
    const pelangganCount = await seedPelanggan();
    const dokterCount = await seedDokter();
    const transaksiCount = await seedTransaksi(pelangganCount, dokterCount, cabangCount);
    await seedTransaksiDetail(transaksiCount, 100); // Assuming 100 mainstock items
    await seedReturPenjualan(transaksiCount, 100); // Assuming 100 mainstock items
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