import prisma from "../config/prisma";

export const antrianService = {
  async addAntrian(idPelanggan: number, kdCab: string, isPermanent: boolean = false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const lastAntrian = await prisma.antrian.findFirst({
      where: {
        tanggal: {
          gte: today
        },
        kd_cab: kdCab
      },
      orderBy: {
        no_antrian: 'desc'
      }
    });
  
    const noAntrian = lastAntrian ? lastAntrian.no_antrian! + 1 : 1;
  
    return prisma.antrian.create({
      data: {
        no_antrian: noAntrian,
        id_pelanggan: idPelanggan,
        kd_cab: kdCab,
        tanggal: new Date(),
        mulai: new Date().toISOString(),
        status: 'MENUNGGU',
        is_permanent: isPermanent
      }
    });
  },

  async finishAntrian(idAntrian: number) {
    const antrian = await prisma.antrian.findUnique({
      where: { id_antrian: idAntrian }
    });
  
    if (!antrian) throw new Error('Antrian tidak ditemukan');
  
    const selesai = new Date();
    const mulai = new Date(antrian.mulai!);
    const durasiDetik = Math.floor((selesai.getTime() - mulai.getTime()) / 1000);
  
    return prisma.antrian.update({
      where: { id_antrian: idAntrian },
      data: {
        selesai: selesai.toISOString(),
        timer: durasiDetik.toString(),
        status: 'SELESAI'
      }
    });
  },

  async continuePendingAntrian(idAntrian: number) {
    const antrian = await prisma.antrian.findUnique({
      where: { id_antrian: idAntrian },
      include: {
        keranjang: true
      }
    });
  
    if (!antrian) throw new Error('Antrian tidak ditemukan');
    // if (antrian.status !== 'PENDING') throw new Error('Antrian tidak dalam status PENDING');
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const lastAntrian = await prisma.antrian.findFirst({
      where: {
        tanggal: {
          gte: today
        },
        kd_cab: antrian.kd_cab,
        status: {
          not: 'PENDING'
        }
      },
      orderBy: {
        no_antrian: 'desc'
      }
    });
  
    const nextAntrianNumber = lastAntrian?.no_antrian ? lastAntrian.no_antrian + 1 : 1;
  
    // Update antrian dengan nomor baru
    return prisma.antrian.update({
      where: { id_antrian: idAntrian },
      data: {
        status: 'MENUNGGU',
        no_antrian: nextAntrianNumber
      },
    });
  },

  async getAntrianToday(kdCab: string, includePermanent: boolean = false) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.antrian.findMany({
      where: {
        kd_cab: kdCab,
        OR: [
          {
            tanggal: {
              gte: today
            }
          },
          ...(includePermanent ? [{ is_permanent: true }] : [])
        ]
      },
      orderBy: {
        no_antrian: 'asc'
      }
    });
  },

  async getCurrentAntrianInfo(kdCab: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastAntrian = await prisma.antrian.findFirst({
      where: {
        tanggal: {
          gte: today
        },
        kd_cab: kdCab
      },
      orderBy: {
        no_antrian: 'desc'
      }
    });

    const noAntrian = lastAntrian ? lastAntrian.no_antrian! : 1;
    const periode = today.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return {
      noAntrian,
      periode
    };
  }
};
