import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface CreateFakturPembelianDto {
  nomor_pembelian: string;
  jns_trans: string;
  no_reff: string;
  tgl_reff: Date;
  id_supplier: number;
  sub_total: number;
  total: number;
  keterangan?: string;
  tanggal_jt: Date;
  userId: number;
  status_bayar: string;
}

export const fakturPembelianController = {
  async create(req: Request<{}, {}, Partial<CreateFakturPembelianDto>>, res: Response) {
    try {
      const fakturData: Partial<CreateFakturPembelianDto> = req.body;

      // Perform type conversions and validations as needed
      if (typeof fakturData.id_supplier === 'string') fakturData.id_supplier = parseInt(fakturData.id_supplier, 10);
      if (typeof fakturData.sub_total === 'string') fakturData.sub_total = parseFloat(fakturData.sub_total);
      if (typeof fakturData.total === 'string') fakturData.total = parseFloat(fakturData.total);
      if (typeof fakturData.userId === 'string') fakturData.userId = parseInt(fakturData.userId, 10);

      // Validate required fields
      if (!fakturData.nomor_pembelian || !fakturData.id_supplier) {
        throw new Error('nomor_pembelian and id_supplier are required fields');
      }

      const newFaktur = await prisma.fakturPembelian.create({
        data: fakturData,
      });

      console.log('New faktur pembelian created:', newFaktur);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Faktur pembelian created successfully',
        data: newFaktur,
      });
    } catch (error) {
      console.error('Error creating faktur pembelian:', error);
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create new faktur pembelian',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'tgl_reff';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
      const status = req.query.status as string;

      const skip = (page - 1) * limit;

      const where = {
        AND: [
          search ? {
            OR: [
              { nomor_pembelian: { contains: search, mode: 'insensitive' } },
              { no_reff: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          status ? { status_bayar: status } : {},
        ],
      };

      const [fakturList, totalCount] = await Promise.all([
        prisma.fakturPembelian.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { supplier: true },
        }),
        prisma.fakturPembelian.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Faktur pembelian list retrieved successfully',
        data: fakturList,
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
        message: 'Failed to fetch faktur pembelian list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedFaktur = await prisma.fakturPembelian.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Faktur pembelian updated successfully',
        data: updatedFaktur,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update faktur pembelian',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.fakturPembelian.delete({
        where: { id: parseInt(id) },
      });
      res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: 'Faktur pembelian deleted successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to delete faktur pembelian',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};