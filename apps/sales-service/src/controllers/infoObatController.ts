import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface CreateObatDto {
  nm_brgdg: string;
  isi?: number;
  id_kategori?: number;
  strip: number;
  mark_up?: number;
  hb_netto?: number;
  hb_gross?: number;
  hj_ecer?: number;
  hj_bbs?: number;
  id_pabrik?: number;
  barcode?: string;
  created_by?: string;
  hpp?: number;
  q_bbs?: number;
  tgl_new_product?: string;
  konsinyasi?: boolean;
  halodoc?: boolean;
  bpjs?: boolean;
  id_kl?: number;
  status?: number;
  moq?: number;
  min_bulan_ed?: number;
  hb_net?: number;
  mark_up_purchasing?: number;
  hna?: number;
  hj_masiva?: number;
  q_temp_out?: number;
  q_exp?: number;
  disc1?: number;
  q_akhir?: number;
  het?: number;
  berat?: number;
  id_brand?: number;
  wso2transfer?: boolean;
  is_updated?: boolean;
  dosis?: string;
  aturan_pakai?: string;
  komposisi?: string;
  indikasi?: string;
  deskripsi?: string;
}

export const infoObatController = {
  async create(req: Request<{}, {}, Partial<CreateObatDto>>, res: Response) {
    try {
      const obatData: Partial<CreateObatDto> = req.body;

      // Perform type conversions
      if (typeof obatData.strip === 'string') obatData.strip = parseInt(obatData.strip, 10);
      if (typeof obatData.id_kategori === 'string') obatData.id_kategori = parseInt(obatData.id_kategori, 10);
      if (typeof obatData.id_pabrik === 'string') obatData.id_pabrik = parseInt(obatData.id_pabrik, 10);
      if (typeof obatData.hj_bbs === 'string') obatData.hj_bbs = parseFloat(obatData.hj_bbs);

      // Validate required fields
      if (!obatData.nm_brgdg || !obatData.strip) {
        throw new Error('nm_brgdg and strip are required fields');
      }

      // Separate id_kategori from the rest of the data
      const { id_kategori, ...mainStockData } = obatData;

      const newObat = await prisma.tMainStock.create({
        data: {
          nm_brgdg: obatData.nm_brgdg!,
          strip: obatData.strip!,
          kd_cab: "DEFAULT",
          ...mainStockData,
          id_kategori: id_kategori || null,
        },
      });

      console.log('New obat created:', newObat);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Obat created successfully',
        data: newObat,
      });
    } catch (error) {
      console.error('Error creating obat:', error);
      
      res.status(HTTP_STATUS.BAD_REQUEST).json({
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
              { nm_brgdg: { contains: search, mode: 'insensitive' as const } },
              { barcode: { equals: search } },
            ],
          } : {},
          kategori ? { id_kategori: kategori } : {},
        ],
      };

      const currentDate = new Date();

      const [obatList, totalCount] = await Promise.all([
        prisma.tMainStock.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { 
            kategori: true,
          },
        }),
        prisma.tMainStock.count({ where }),
      ]);
    
      const processedObatList = obatList.map((obat: any) => {
        return Object.fromEntries(
          Object.entries(obat).map(([key, value]) => [
            key,
            typeof value === 'number' ? Math.round(value) : value
          ])
        );
      });

      const totalPages = Math.ceil(totalCount / limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Obat list retrieved successfully',
        data: processedObatList,
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
        message: 'Failed to fetch obat list',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { kd_brgdg } = req.params;
      const updatedObat = await prisma.tMainStock.update({
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
      await prisma.tMainStock.delete({
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

  async getById(req: Request, res: Response) {
    try {
      const { kd_brgdg } = req.params;
      const obat = await prisma.tMainStock.findUnique({
        where: { kd_brgdg: parseInt(kd_brgdg) },
        include: { 
          kategori: true,
        },
      });

      if (!obat) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Obat not found',
        });
      }

      const processedObat = {
      };

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Obat retrieved successfully',
        data: processedObat,
      });
    } catch (error) {
      console.error('Error fetching obat:', error);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch obat',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  },
};