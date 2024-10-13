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

      const newObat = await prisma.tmainstock.create({
        data: {
          ...mainStockData,
          kategori: id_kategori ? { connect: { id: id_kategori } } : undefined,
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
              { nm_brgdg: { contains: search, mode: 'insensitive' } },
              { barcode: { equals: search } },
            ],
          } : {},
          kategori ? { id_kategori: kategori } : {},
        ],
      };

      const currentDate = new Date();

      const [obatList, totalCount] = await Promise.all([
        prisma.tmainstock.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: { 
            kategori: true,
            promos: {
              where: {
                tanggal_awal: { lte: currentDate },
                tanggal_akhir: { gte: currentDate },
                deleted_at: null,
              },
            },
          },
        }),
        prisma.tmainstock.count({ where }),
      ]);
    
      const processedObatList = obatList.map((obat: any) => {
        const activePromo = obat.promos.find((promo: any) => 
          promo.tanggal_awal <= currentDate && 
          promo.tanggal_akhir >= currentDate && 
          promo.deleted_at === null
        );
        return {
          ...obat,
          activePromo: activePromo ? {
            id: activePromo.id,
            nama: activePromo.nama,
            diskon: activePromo.diskon,
            jenis_promo: activePromo.jenis_promo,
            min_pembelian: activePromo.min_pembelian,
            max_diskon: activePromo.max_diskon,
            kuantitas_beli: activePromo.kuantitas_beli,
            kuantitas_gratis: activePromo.kuantitas_gratis,
          } : null,
        };
      });

      // Log only the data with active promos
      const obatWithActivePromos = processedObatList.filter((obat: any) => obat.activePromo !== null);
      console.log('Obat with active promos:', JSON.stringify(obatWithActivePromos, null, 2));

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
      const updatedObat = await prisma.tmainstock.update({
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
      await prisma.tmainstock.delete({
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
      const obat = await prisma.tmainstock.findUnique({
        where: { kd_brgdg: parseInt(kd_brgdg) },
        include: { 
          kategori: true,
          promos: {
            // where: {
            //   tanggal_awal: { lte: new Date() },
            //   tanggal_akhir: { gte: new Date() },
            //   deleted_at: null,
            // },
          },
        },
      });

      if (!obat) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Obat not found',
        });
      }

      const processedObat = {
        ...obat,
        activePromo: obat.promos.length > 0 ? {
          id: obat.promos[0].id,
          nama: obat.promos[0].nama,
          diskon: obat.promos[0].diskon,
          jenis_promo: obat.promos[0].jenis_promo,
          min_pembelian: obat.promos[0].min_pembelian,
          max_diskon: obat.promos[0].max_diskon,
          kuantitas_beli: obat.promos[0].kuantitas_beli,
          kuantitas_gratis: obat.promos[0].kuantitas_gratis,
        } : null,
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