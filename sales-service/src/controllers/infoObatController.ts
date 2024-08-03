import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

export const infoObatController = {
  async create(req: Request, res: Response) {
    try {
      const newObat = await prisma.mainstock.create({
        data: req.body,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Obat created successfully',
        data: newObat,
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to create new obat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'nm_brgdg';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'asc';
      const kategori = parseInt(req.query.kategori as string) || undefined;

      const skip = (page - 1) * limit;

      const where = {
        AND: [
          search ? {
            OR: [
              { nm_brgdg: { contains: search, mode: 'insensitive' } },
              { barcode: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          kategori ? { id_kategori: kategori } : {},
        ],
      };

      const [obatList, totalCount] = await Promise.all([
        prisma.mainstock.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { category: true },
        }),
        prisma.mainstock.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: 'Obat list retrieved successfully',
        data: obatList,
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
        message: 'Failed to fetch obat list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { kd_brgdg } = req.params;
      const updatedObat = await prisma.mainstock.update({
        where: { kd_brgdg: parseInt(kd_brgdg) },
        data: req.body,
      });
      res
      .status(HTTP_STATUS.OK)
      .json({
        success: true,
        message: 'Obat updated successfully',
        data: updatedObat,
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to update obat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { kd_brgdg } = req.params;
      await prisma.mainstock.delete({
        where: { kd_brgdg: parseInt(kd_brgdg) },
      });
      res
      .status(HTTP_STATUS.NO_CONTENT)
      .json({
        success: true,
        message: 'Obat deleted successfully',
      });
    } catch (error) {
      res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({
        success: false,
        message: 'Failed to delete obat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};