import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';
import { Prisma } from '@prisma/client';

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

      // Convert CreatePenerimaanDto to PenerimaanCreateInput
      const createData: any = {
        nomor_sp: penerimaanData.nomor_sp,
        nomor_preorder: penerimaanData.nomor_preorder,
        tgl_preorder: penerimaanData.tgl_preorder,
        scan: penerimaanData.scan,
        jns_trans: penerimaanData.jns_trans,
        no_reff: penerimaanData.no_reff,
        tgl_reff: penerimaanData.tgl_reff,
        nama_supplier: penerimaanData.nama_supplier,
        total: penerimaanData.total,
        keterangan: penerimaanData.keterangan,
        tanggal_jt: penerimaanData.tanggal_jt,
        userId: penerimaanData.userId,
        status_approval: penerimaanData.status_approval,
        tgl_approve: penerimaanData.tgl_approve,
      };

      const newPenerimaan = await prisma.penerimaan.create({
        data: createData,
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
      const date = req.query.date as string;
      const skip = (page - 1) * limit;

      const where: any = {
        AND: [
          search ? {
            OR: [
              { nomor_sp: { contains: search, mode: 'insensitive' } },
              { nomor_preorder: { contains: search, mode: 'insensitive' } },
              { nama_supplier: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          status ? { status_approval: status } : {},
          date ? {
            created_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`)
            }
          } : {},
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