import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface CreateETicketDto {
  no_lpb: string;
  jenis_transaksi: string;
  tgl_lpb: Date;
  polos: boolean;
  no_reff: string;
  total: number;
  keterangan?: string;
  userId: number;
}

export const eTicketController = {
  async create(req: Request<{}, {}, Partial<CreateETicketDto>>, res: Response) {
    try {
      const eTicketData: Partial<CreateETicketDto> = req.body;

      // Perform type conversions and validations as needed
      if (typeof eTicketData.polos === 'string') eTicketData.polos = eTicketData.polos === 'true';
      if (typeof eTicketData.total === 'string') eTicketData.total = parseFloat(eTicketData.total);
      if (typeof eTicketData.userId === 'string') eTicketData.userId = parseInt(eTicketData.userId, 10);

      // Validate required fields
      if (!eTicketData.no_lpb || !eTicketData.jenis_transaksi) {
        throw new Error('no_lpb and jenis_transaksi are required fields');
      }

      const newETicket = await prisma.eTicket.create({
        data: eTicketData,
      });

      console.log('New e-ticket created:', newETicket);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'E-ticket created successfully',
        data: newETicket,
      });
    } catch (error) {
      console.error('Error creating e-ticket:', error);
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to create new e-ticket',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'tgl_lpb';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
      const jenis = req.query.jenis as string;

      const skip = (page - 1) * limit;

      const where = {
        AND: [
          search ? {
            OR: [
              { no_lpb: { contains: search, mode: 'insensitive' } },
              { no_reff: { contains: search, mode: 'insensitive' } },
            ],
          } : {},
          jenis ? { jenis_transaksi: jenis } : {},
        ],
      };

      const [eTicketList, totalCount] = await Promise.all([
        prisma.eTicket.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.eTicket.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'E-ticket list retrieved successfully',
        data: eTicketList,
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
        message: 'Failed to fetch e-ticket list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedETicket = await prisma.eTicket.update({
        where: { id: parseInt(id) },
        data: req.body,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'E-ticket updated successfully',
        data: updatedETicket,
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to update e-ticket',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.eTicket.delete({
        where: { id: parseInt(id) },
      });
      res.status(HTTP_STATUS.NO_CONTENT).json({
        success: true,
        message: 'E-ticket deleted successfully',
      });
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Failed to delete e-ticket',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};