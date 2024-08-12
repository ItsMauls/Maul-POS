import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface CreateSuratPesananDto {
  nomor_sp: string;
  tgl_pr: Date;
  jns_trans: string;
  id_supplier: number;
  total: number;
  keterangan?: string;
  userId: number;
  status_approval: string;
  tgl_approve?: Date;
}

export const suratPesananController = {
  async create(req: Request<{}, {}, Partial<CreateSuratPesananDto>>, res: Response) {
    try {
      const suratPesananData: Partial<CreateSuratPesananDto> = req.body;

      // Validate required fields
      if (!suratPesananData.nomor_sp || !suratPesananData.id_supplier) {
        throw new Error('nomor_sp and id_supplier are required fields');
      }

      // Ensure all required fields are present
      const requiredFields: (keyof CreateSuratPesananDto)[] = [
        'nomor_sp', 'tgl_pr', 'jns_trans', 'id_supplier', 'total', 'userId', 'status_approval'
      ];
      for (const field of requiredFields) {
        if (suratPesananData[field] === undefined) {
          throw new Error(`${field} is a required field`);
        }
      }

      const newSuratPesanan = await prisma.suratPesanan.create({
        data: suratPesananData as CreateSuratPesananDto,
      });

      console.log('New surat pesanan created:', newSuratPesanan);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Surat Pesanan created successfully',
        data: newSuratPesanan,
      });
    } catch (error) {
      console.error('Error creating surat pesanan:', error);
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create new surat pesanan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'nomor_sp';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'asc';
      const status = req.query.status as string;
      const date = req.query.date as string;

      const skip = (page - 1) * limit;

      const where: any = {
        AND: [
          search ? {
            OR: [
              { nomor_sp: { contains: search, mode: 'insensitive' } },
              { jns_trans: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          status ? { status_approval: status } : {},
          date ? {
            tgl_approve: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`)
            }
          } : {},
        ],
      };

      const [suratPesananList, totalCount] = await Promise.all([
        prisma.suratPesanan.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { supplier: true },
        }),
        prisma.suratPesanan.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Surat Pesanan list retrieved successfully',
        data: suratPesananList,
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
        message: 'Failed to fetch surat pesanan list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const suratPesanan = await prisma.suratPesanan.findUnique({
        where: { id: parseInt(id) },
        include: { supplier: true },
      });

      if (!suratPesanan) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Surat Pesanan not found',
        });
      }

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Surat Pesanan retrieved successfully',
        data: suratPesanan,
      });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch surat pesanan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedSuratPesanan = await prisma.suratPesanan.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Surat Pesanan updated successfully',
        data: updatedSuratPesanan,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update surat pesanan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.suratPesanan.delete({
        where: { id: parseInt(id) },
      });
      res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: 'Surat Pesanan deleted successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to delete surat pesanan',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};