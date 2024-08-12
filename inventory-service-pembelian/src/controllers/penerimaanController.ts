import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface CreatePenerimaanDto {
  nomor_sp: string;
  nomor_preorder: string;
  tgl_preorder: Date;
  scan?: string;
  jns_trans: string;
  no_reff: string;
  tgl_reff: Date;
  nama_supplier: string;
  total: number;
  keterangan?: string;
  tanggal_jt: Date;
  userId: number;
  status_approval: string;
  tgl_approve?: Date;
}

export const penerimaanController = {
  async create(req: Request<{}, {}, Partial<CreatePenerimaanDto>>, res: Response) {
    try {
      const penerimaanData: Partial<CreatePenerimaanDto> = req.body;

      // Perform type conversions and validations as needed
      if (typeof penerimaanData.total === 'string') penerimaanData.total = parseFloat(penerimaanData.total);
      if (typeof penerimaanData.userId === 'string') penerimaanData.userId = parseInt(penerimaanData.userId, 10);

      // Validate required fields
      if (!penerimaanData.nomor_sp || !penerimaanData.nomor_preorder) {
        throw new Error('nomor_sp and nomor_preorder are required fields');
      }

      const newPenerimaan = await prisma.penerimaan.create({
        data: penerimaanData,
      });

      console.log('New penerimaan created:', newPenerimaan);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Penerimaan created successfully',
        data: newPenerimaan,
      });
    } catch (error) {
      console.error('Error creating penerimaan:', error);
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create new penerimaan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'tgl_preorder';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
      const status = req.query.status as string;

      const skip = (page - 1) * limit;

      const where = {
        AND: [
          search ? {
            OR: [
              { nomor_sp: { contains: search, mode: 'insensitive' } },
              { nomor_preorder: { contains: search, mode: 'insensitive' } },
              { nama_supplier: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          status ? { status_approval: status } : {},
        ],
      };

      const [penerimaanList, totalCount] = await Promise.all([
        prisma.penerimaan.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { suratPesanan: true },
        }),
        prisma.penerimaan.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Penerimaan list retrieved successfully',
        data: penerimaanList,
        meta: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      });
    } catch (error) {
      console.log(error instanceof Error ? error.message : String(error));
      
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch penerimaan list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedPenerimaan = await prisma.penerimaan.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Penerimaan updated successfully',
        data: updatedPenerimaan,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update penerimaan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.penerimaan.delete({
        where: { id: parseInt(id) },
      });
      res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: 'Penerimaan deleted successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to delete penerimaan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};