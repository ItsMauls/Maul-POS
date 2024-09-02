import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const createPromo = async (req: Request, res: Response) => {
  const { 
    nama, 
    deskripsi, 
    diskon, 
    tanggalAwal, 
    tanggalAkhir, 
    jamAwalPromo, 
    jamAkhirPromo, 
    noPromo, jenisPromo, mainstockId } = req.body;

  try {
    const promo = await prisma.promo.create({
      data: {
        nama,
        deskripsi,
        diskon,
        tanggal_awal: new Date(tanggalAwal),
        tanggal_akhir: new Date(tanggalAkhir),
        jam_awal_promo: jamAwalPromo,
        jam_akhir_promo: jamAkhirPromo,
        no_promo: noPromo,
        jenis_promo: jenisPromo,
        mainstockId,
      },
    });

    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create promo' });
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

    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve promos' });
  }
};