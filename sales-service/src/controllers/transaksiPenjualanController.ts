import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

export const transaksiPenjualanController = {
  async create(req: Request, res: Response) {
    try {
      const newTransaksi = await prisma.transaksiPenjualan.create({
        data: req.body,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Transaksi penjualan created successfully',
        data: newTransaksi,
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to create new transaksi penjualan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'created_at';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

      const skip = (page - 1) * limit;

      const where = search ? {
        OR: [
          { noFaktur: { contains: search, mode: 'insensitive' } },
          { namaPelanggan: { contains: search, mode: 'insensitive' } },
        ],
      } : {};

      const [transaksiList, totalCount] = await Promise.all([
        prisma.transaksiPenjualan.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        //   include: { items: true },
        }),
        prisma.transaksiPenjualan.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: 'Transaksi penjualan list retrieved successfully',
        data: transaksiList,
        meta: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({
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
