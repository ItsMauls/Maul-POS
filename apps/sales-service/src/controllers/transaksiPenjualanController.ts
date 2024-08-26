import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface RequestWithUser extends Request {
  user?: any;
}


export const transaksiPenjualanController = {
  async createTransaction(req: RequestWithUser, res: Response) {
    try {
      const user = req.user as any
      console.log(user, 'user');
      
      const {
        pelanggan,
        dokter,
        sales_pelayan,
        jenis_penjualan,
        invoice_eksternal,
        catatan,
        total_harga,
        total_disc,
        total_sc_misc,
        total_promo,
        total_up,
        no_voucher,
        interval_transaksi,
        buffer_transaksi,
        kd_cab,
        items
      } = req.body;

      const transaction = await prisma.transaksi.create({
        data: {
          pelanggan: {
            create: {
              nama: pelanggan.nama,
              alamat: pelanggan.alamat,
              no_telp: pelanggan.noTelp,
              usia: parseInt(pelanggan.usia) || null,
              instansi: pelanggan.instansi,
              korp: pelanggan.korp,
            }
          },
          dokter: {
            create: {
              nama: dokter.nama,
              alamat: dokter.alamat,
              spesialisasi: dokter.noTelp || null,
            }
          },
          sales_pelayan: user.username,
          jenis_penjualan,
          invoice_eksternal,
          catatan,
          total_harga,
          total_disc,
          total_sc_misc,
          total_promo,
          total_up,
          no_voucher,
          interval_transaksi,
          buffer_transaksi,
          cabang: {
            connect: { kd_cab: kd_cab }
          },
          TransaksiDetail: {
            create: items.map((item: any) => ({
              kd_brgdg: item.kd_brgdg,
              jenis: item.rOption || 'R', // Provide a default value if undefined
              harga: item.hj_ecer || 0,
              qty: item.qty || 1,
              subjumlah: item.subJumlah || 0,
              disc: item.disc || 0,
              sc_misc: item.sc_misc || 0,
              promo: item.promo || 0,
              disc_promo: item.discPromo || 0,
              up: item.up || 0,
            }))
          }
        },
        include: {
          pelanggan: true,
          dokter: true,
          TransaksiDetail: true,
          cabang: true,
        },
      });

      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  },


  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'created_at';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
      const date = req.query.date as string;

      const skip = (page - 1) * limit;

      let where: any = {};

      if (search) {
        where.OR = [
          { id: { equals: parseInt(search) } }, // Assuming 'id' is used as 'no bon'
          { sales_pelayan: { contains: search, mode: 'insensitive' } },
          { pelanggan: { nama: { contains: search, mode: 'insensitive' } } },
          { dokter: { nama: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (date) {
        where.created_at = {
          gte: new Date(`${date}T00:00:00Z`),
          lt: new Date(`${date}T23:59:59Z`),
        };
      }

      const [transaksiList, totalCount] = await Promise.all([
        prisma.transaksi.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true, // 'no bon'
            created_at: true, // 'tanggal' and 'jam'
            sales_pelayan: true, // 'kasir'
            pelanggan: {
              select: {
                nama: true,
                alamat: true,
                instansi: true,
              },
            },
            dokter: {
              select: {
                nama: true,
              },
            },
          },
        }),
        prisma.transaksi.count({ where }),
      ]);

      const formattedTransaksiList = transaksiList.map((t: any) => ({
        no_bon: t.id,
        tanggal: t.created_at.toISOString().split('T')[0],
        jam: t.created_at.toISOString().split('T')[1].substring(0, 5),
        kasir: t.sales_pelayan,
        kassa: 'N/A', // This information is not in your current model
        shift: 'N/A', // This information is not in your current model
        customer: t.pelanggan.nama,
        alamat: t.pelanggan.alamat,
        instansi: t.pelanggan.instansi,
        dokter: t.dokter.nama,
      }));

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Transaksi penjualan list retrieved successfully',
        data: formattedTransaksiList,
        meta: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch transaksi penjualan list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaksi = await prisma.transaksiPenjualan.findUnique({
        where: { id: parseInt(id) },
        include: { items: true },
      });

      if (!transaksi) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Transaksi penjualan not found',
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Transaksi penjualan retrieved successfully',
        data: transaksi,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedTransaksi = await prisma.transaksiPenjualan.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: 'Transaksi penjualan updated successfully',
        data: updatedTransaksi,
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to update transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.transaksiPenjualan.delete({
        where: { id: parseInt(id) },
      });
      res
      .status(HTTP_STATUS.NO_CONTENT)
      .json({
        success: true,
        message: 'Transaksi penjualan deleted successfully',
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to delete transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};