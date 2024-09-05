import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

export const createPromo = async (req: Request, res: Response) => {
  const { 
    nama, 
    deskripsi, 
    diskon, 
    tanggalAwal, 
    tanggalAkhir, 
    jamAwalPromo, 
    jamAkhirPromo, 
    noPromo, 
    jenisPromo, 
    mainstockId,
    // New fields for specific promo types
    minPembelian,
    maxDiskon,
    kuantitasBeli,
    kuantitasGratis
  } = req.body;

  try {
    let promoData: any = {
      nama,
      deskripsi,
      tanggal_awal: new Date(tanggalAwal),
      tanggal_akhir: new Date(tanggalAkhir),
      jam_awal_promo: jamAwalPromo,
      jam_akhir_promo: jamAkhirPromo,
      no_promo: noPromo,
      jenis_promo: jenisPromo,
      max_diskon: maxDiskon,
      min_pembelian: minPembelian,
      kuantitas_beli: kuantitasBeli,
      kuantitas_gratis: kuantitasGratis,
      mainstockId,
    };

    switch (jenisPromo) {
      case 'BUY_ONE_GET_ONE':
        promoData.kuantitas_beli = kuantitasBeli || 1;
        promoData.kuantitas_gratis = kuantitasGratis || 1;
        break;
      case 'POTONGAN_HARGA':
        promoData.diskon = diskon;
        promoData.min_pembelian = minPembelian;
        promoData.max_diskon = maxDiskon;
        break;
      case 'PERSENTASE_DISKON':
        promoData.diskon = diskon;
        promoData.max_diskon = maxDiskon;
        break;
      case 'BUNDLE_DISKON':
        promoData.min_pembelian = minPembelian;
        promoData.diskon = diskon;
        break;
      case 'CASHBACK':
        promoData.diskon = diskon;
        promoData.min_pembelian = minPembelian;
        promoData.max_diskon = maxDiskon;
        break;
      default:
        throw new Error('Invalid promo type');
    }

    const promo = await prisma.promo.create({ data: promoData });

    res.status(HTTP_STATUS.CREATED).json(promo);
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create promo' });
  }
};

export const getPromos = async (req: Request, res: Response) => {
  try {
    const promos = await prisma.promo.findMany({
      include: {
        mainstock: true,
        TransaksiDetail: true,
      },
    });

    res.status(HTTP_STATUS.OK).json(promos);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Failed to retrieve promos' });
  }
};