import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Seed Kategori - pastikan ini berhasil dulu
async function seedKategori() {
  const kategoriData = [
    { nm_kategori: 'OBAT' },
    { nm_kategori: 'ALKES' },
    { nm_kategori: 'KOSMETIK' },
    { nm_kategori: 'SUSU' },
    { nm_kategori: 'MAKANAN' },
    { nm_kategori: 'MINUMAN' },
    { nm_kategori: 'HERBAL' },
    { nm_kategori: 'VITAMIN' },
    { nm_kategori: 'ANTIBIOTIK' },
    { nm_kategori: 'ANTISEPTIK' }
  ];

  const createdKategori = await prisma.mKategori.createMany({
    data: kategoriData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdKategori.count} Kategori records`);
  return createdKategori.count;
}

// Seed Satuan - gunakan data fixed
async function seedSatuan() {
  const satuanData = [
    { nm_satuan: 'PCS' },
    { nm_satuan: 'BOX' },
    { nm_satuan: 'STRIP' },
    { nm_satuan: 'BOTOL' },
    { nm_satuan: 'TUBE' },
    { nm_satuan: 'SACHET' },
    { nm_satuan: 'AMPUL' },
    { nm_satuan: 'VIAL' },
    { nm_satuan: 'KAPLET' },
    { nm_satuan: 'TABLET' }
  ];

  const createdSatuan = await prisma.mSatuan.createMany({
    data: satuanData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdSatuan.count} Satuan records`);
  return createdSatuan.count;
}

// Seed Cabang - gunakan data fixed untuk kd_cab
async function seedCabang() {
  const cabangData = Array.from({ length: 10 }, (_, index) => ({
    kd_cab: `CAB${String(index + 1).padStart(3, '0')}`,
    nm_cab: `Cabang ${index + 1}`,
    alamat: faker.location.streetAddress().substring(0, 255),
    no_telepon: faker.phone.number().substring(0, 20),
    no_hp: faker.phone.number().substring(0, 20),
    email: faker.internet.email().substring(0, 100),
    shift: faker.number.int({ min: 1, max: 3 }),
    bpjs: faker.datatype.boolean(),
    offline: faker.datatype.boolean(),
    proses: faker.datatype.boolean()
  }));

  const createdCabang = await prisma.mCabang.createMany({
    data: cabangData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdCabang.count} Cabang records`);
  return createdCabang.count;
}

// Seed Pabrik
async function seedPabrik() {
  const pabrikData = Array.from({ length: 20 }, () => ({
    nm_pabrik: faker.company.name().substring(0, 255),
    alamat: faker.location.streetAddress(),
    no_telepon: faker.phone.number().substring(0, 20),
    email: faker.internet.email().substring(0, 100),
    no_npwp: faker.string.numeric(15).substring(0, 50),
    nm_npwp: faker.company.name().substring(0, 255),
    alamat_npwp: faker.location.streetAddress(),
    min_bulan_ed: faker.number.int({ min: 1, max: 36 }),
    informasi_retur: faker.lorem.sentence(),
    prf_telp: faker.phone.number().substring(0, 20),
  }));

  const createdPabrik = await prisma.mPabrik.createMany({
    data: pabrikData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdPabrik.count} Pabrik records`);
  return createdPabrik.count;
}

// Seed KL Produk
async function seedKLProduk() {
  const klProdukData = Array.from({ length: 15 }, () => ({
    nm_kl: faker.commerce.productName(),
  }));

  const createdKLProduk = await prisma.mKLProduk.createMany({
    data: klProdukData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdKLProduk.count} KL Produk records`);
  return createdKLProduk.count;
}

// Seed Rack Pusdis
async function seedRackPusdis(kategoriCount: number) {
  const rackPusdisData = Array.from({ length: 30 }, () => ({
    nm_dept: faker.commerce.department(),
    id_kategori: faker.number.int({ min: 1, max: kategoriCount }),
    created_by: faker.internet.username(),
    updated_by: faker.internet.username(),
    nm_kategori: faker.commerce.department(),
  }));

  const createdRackPusdis = await prisma.mRackPusdis.createMany({
    data: rackPusdisData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdRackPusdis.count} Rack Pusdis records`);
  return createdRackPusdis.count;
}

// Seed MainStock
async function seedMainStock(kategoriCount: number, satuanCount: number, pabrikCount: number, klProdukCount: number, rackPusdisCount: number) {
  const mainStockData = Array.from({ length: 100 }, () => ({
    nm_brgdg: faker.commerce.productName().substring(0, 255),
    id_dept: faker.number.int({ min: 1, max: 10 }),
    isi: faker.number.int({ min: 1, max: 100 }),
    id_satuan: faker.number.int({ min: 1, max: satuanCount }),
    strip: faker.number.int({ min: 1, max: 20 }),
    mark_up: faker.number.float({ min: 0.1, max: 0.5 }),
    hb_netto: faker.number.float({ min: 1000, max: 100000 }),
    hb_gross: faker.number.float({ min: 1000, max: 100000 }),
    hj_ecer: faker.number.float({ min: 1500, max: 150000 }),
    hj_bbs: faker.number.float({ min: 1200, max: 120000 }),
    id_kategori: faker.number.int({ min: 1, max: kategoriCount }),
    id_pabrik: faker.number.int({ min: 1, max: pabrikCount }),
    barcode: faker.string.numeric(13),
    created_by: faker.internet.userName().substring(0, 50),
    hpp: faker.number.float({ min: 800, max: 80000 }),
    q_bbs: faker.number.int({ min: 0, max: 1000 }),
    tgl_new_product: faker.date.past(),
    konsinyasi: faker.datatype.boolean(),
    halodoc: faker.datatype.boolean(),
    bpjs: faker.datatype.boolean(),
    informasi_po: faker.lorem.sentence().substring(0, 255),
    informasi_tanggal_ed_po: faker.date.future(),
    aturan_pakai: faker.lorem.sentence().substring(0, 255),
    komposisi: faker.lorem.sentence().substring(0, 255),
    indikasi: faker.lorem.sentence().substring(0, 255),
    dosis: faker.lorem.sentence().substring(0, 255),
    trading_term: faker.lorem.word().substring(0, 255),
    id_kl: faker.number.int({ min: 1, max: klProdukCount }),
    status: faker.number.int({ min: 0, max: 3 }),
    moq: faker.number.int({ min: 1, max: 100 }),
    min_bulan_ed: faker.number.int({ min: 1, max: 36 }),
    informasi_return: faker.lorem.sentence().substring(0, 255),
    barcode_big: faker.string.numeric(14),
    hb_net: faker.number.float({ min: 900, max: 90000 }),
    mark_up_purchasing: faker.number.float({ min: 0.05, max: 0.3 }),
    hna: faker.number.float({ min: 1100, max: 110000 }),
    hj_masiva: faker.number.float({ min: 1300, max: 130000 }),
    sup1: faker.company.name().substring(0, 255),
    q_temp_out: faker.number.int({ min: 0, max: 500 }),
    q_exp: faker.number.int({ min: 0, max: 100 }),
    disc1: faker.number.float({ min: 0, max: 0.3 }),
    q_akhir: faker.number.int({ min: 0, max: 1000 }),
    produksi: faker.string.alphanumeric(10),
    het: faker.number.float({ min: 1400, max: 140000 }),
    berat: faker.number.float({ min: 0.1, max: 5.0 }),
    nie: faker.string.alphanumeric(15),
    tgl_berlaku_nie: faker.date.future(),
    file_nie: faker.system.filePath().substring(0, 255),
    updated_by: faker.internet.userName().substring(0, 50),
    id_brand: faker.number.int({ min: 1, max: 50 }),
    deskripsi: faker.lorem.sentence().substring(0, 255),
    wso2transfer: faker.datatype.boolean(),
    is_updated: faker.datatype.boolean(),
    kd_cab: `CAB${String(faker.number.int({ min: 1, max: 10 })).padStart(3, '0')}`,
    id_dept_pusdis: faker.number.int({ min: 1, max: rackPusdisCount }),
  }));

  const createdMainStock = await prisma.tMainStock.createMany({
    data: mainStockData,
    skipDuplicates: true,
  });

  console.log(`Seeded ${createdMainStock.count} MainStock records`);
  return createdMainStock.count;
}

// Main seeding function
async function main() {
  try {
    // Hapus data yang ada terlebih dahulu (opsional)
    await prisma.tMainStock.deleteMany({});
    await prisma.mRackPusdis.deleteMany({});
    await prisma.mKLProduk.deleteMany({});
    await prisma.mPabrik.deleteMany({});
    await prisma.mCabang.deleteMany({});
    await prisma.mSatuan.deleteMany({});
    await prisma.mKategori.deleteMany({});

    // Seed data dalam urutan yang benar
    const kategoriCount = await seedKategori();
    const satuanCount = await seedSatuan();
    const cabangCount = await seedCabang();
    const pabrikCount = await seedPabrik();
    const klProdukCount = await seedKLProduk();
    const rackPusdisCount = await seedRackPusdis(kategoriCount);
    
    await seedMainStock(
      kategoriCount,
      satuanCount,
      pabrikCount,
      klProdukCount,
      rackPusdisCount
    );

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error; // Re-throw error untuk melihat stack trace lengkap
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
