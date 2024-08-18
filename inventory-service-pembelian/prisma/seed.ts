import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Seed Supplier
  const suppliers = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return prisma.supplier.create({
        data: {
          nama: faker.company.name() ,
          kd_brgdg: faker.string.alphanumeric(10),
          kd_cab: faker.string.alphanumeric(5),
          created_by: faker.internet.userName(),
          updated_by: faker.internet.userName(),
        },
      });
    })
  );

  // Seed PenerimaanCabang
  await Promise.all(
    suppliers.map((supplier) =>
      prisma.penerimaanCabang.create({
        data: {
          idpo: faker.string.alphanumeric(8),
          kd_cab: supplier.kd_cab,
          kd_brgdg: supplier.kd_brgdg,
          psn: faker.number.int({ min: 1, max: 100 }),
          isi: faker.number.int({ min: 1, max: 50 }),
          qty: faker.number.int({ min: 1, max: 1000 }),
          hna: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          disc: faker.number.float({ min: 0, max: 20, precision: 0.01 }),
          hna_min_disc: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          ppn: faker.number.float({ min: 0, max: 10, precision: 0.01 }),
          hna_plus_ppn: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          total: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
          no_batch: faker.string.alphanumeric(10),
          tgl_expired: faker.date.future(),
          qty_bonus: faker.number.int({ min: 0, max: 10 }),
        },
      })
    )
  );

  // Seed PenerimaanSupplier
  await Promise.all(
    suppliers.map((supplier) =>
      prisma.penerimaanSupplier.create({
        data: {
          id_po: faker.string.alphanumeric(8),
          detail: faker.lorem.sentence(),
          tgl_po: faker.date.past(),
          kd_brgdg: supplier.kd_brgdg,
          nm_brgdg: faker.commerce.productName(),
          id_dept: faker.number.int({ min: 1, max: 10 }),
          isi_pak: faker.number.int({ min: 1, max: 100 }),
          pesanan_outlet: faker.number.int({ min: 1, max: 1000 }),
          pesan_sup: faker.number.int({ min: 1, max: 1000 }),
          ket: faker.lorem.sentence(),
          no_sup: faker.string.alphanumeric(8),
          nm_sup: faker.company.name(),
          disc: faker.number.float({ min: 0, max: 20, precision: 0.01 }),
          no_sp: faker.string.alphanumeric(8),
          tgl_sp: faker.date.past(),
          user_id_pesan: faker.number.int({ min: 1, max: 100 }),
          tgl_input_pesan: faker.date.past(),
          datang: faker.number.int({ min: 0, max: 1 }),
          status: faker.number.int({ min: 0, max: 5 }),
          id_htransb: faker.string.alphanumeric(10),
          cito: faker.datatype.boolean(),
          q_exp: faker.number.int({ min: 0, max: 100 }),
          pesan_box: faker.number.int({ min: 1, max: 100 }),
          max_pesan: faker.number.int({ min: 100, max: 1000 }),
          q_retur: faker.number.int({ min: 0, max: 10 }),
          ket_retur: faker.lorem.sentence(),
          panggil: faker.datatype.boolean(),
          bidding: faker.datatype.boolean(),
          jenis_pesanan: faker.helpers.arrayElement(['Regular', 'Urgent', 'Special']),
          disc_off: faker.number.float({ min: 0, max: 10, precision: 0.01 }),
          tot_disc_off: faker.number.float({ min: 0, max: 100000, precision: 0.01 }),
          tot_disc_off_fin: faker.number.float({ min: 0, max: 100000, precision: 0.01 }),
          is_deleted: false,
          pernah_bidding: faker.datatype.boolean(),
          wso2transfer: faker.datatype.boolean(),
          sudah_terima: faker.datatype.boolean(),
          hb_gross_erp: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          hb_gross_sql: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          value_sql: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          value_erp: faker.number.float({ min: 1000, max: 100000, precision: 0.01 }),
          user_id: faker.number.int({ min: 1, max: 100 }),
        },
      })
    )
  );

  // Seed SuratPesanan
  const suratPesanan = await Promise.all(
    suppliers.map((supplier) =>
      prisma.suratPesanan.create({
        data: {
          nomor_sp: faker.string.alphanumeric(10),
          tgl_pr: faker.date.past(),
          jns_trans: faker.helpers.arrayElement(['Pembelian', 'Retur', 'Konsinyasi']),
          id_supplier: supplier.id,
          total: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
          keterangan: faker.lorem.sentence(),
          userId: faker.number.int({ min: 1, max: 100 }),
          status_approval: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
          tgl_approve: faker.date.recent(),
        },
      })
    )
  );

  // Seed Penerimaan
  await Promise.all(
    suratPesanan.map((sp) =>
      prisma.penerimaan.create({
        data: {
          nomor_sp: sp.nomor_sp,
          nomor_preorder: faker.string.alphanumeric(10),
          tgl_preorder: faker.date.past(),
          scan: faker.system.filePath(),
          jns_trans: faker.helpers.arrayElement(['Pembelian', 'Retur', 'Konsinyasi']),
          no_reff: faker.string.alphanumeric(8),
          tgl_reff: faker.date.past(),
          nama_supplier: faker.company.name(),
          total: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
          keterangan: faker.lorem.sentence(),
          tanggal_jt: faker.date.future(),
          userId: faker.number.int({ min: 1, max: 100 }),
          status_approval: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
          tgl_approve: faker.date.recent(),
        },
      })
    )
  );

  // Seed FakturPembelian
  await Promise.all(
    suppliers.map((supplier) =>
      prisma.fakturPembelian.create({
        data: {
          nomor_pembelian: faker.string.alphanumeric(10),
          jns_trans: faker.helpers.arrayElement(['Pembelian', 'Retur', 'Konsinyasi']),
          no_reff: faker.string.alphanumeric(8),
          tgl_reff: faker.date.past(),
          id_supplier: supplier.id,
          sub_total: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
          total: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
          keterangan: faker.lorem.sentence(),
          tanggal_jt: faker.date.future(),
          userId: faker.number.int({ min: 1, max: 100 }),
          status_bayar: faker.helpers.arrayElement(['Belum Bayar', 'Sebagian', 'Lunas']),
        },
      })
    )
  );

  // Seed ETicket
  await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.eTicket.create({
        data: {
          no_lpb: faker.string.alphanumeric(10),
          jenis_transaksi: faker.helpers.arrayElement(['Pembelian', 'Retur', 'Konsinyasi']),
          tgl_lpb: faker.date.past(),
          polos: faker.datatype.boolean(),
          no_reff: faker.string.alphanumeric(8),
          total: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
          keterangan: faker.lorem.sentence(),
          userId: faker.number.int({ min: 1, max: 100 }),
        },
      })
    )
  );

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });