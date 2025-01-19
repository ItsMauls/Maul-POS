// import { Request, Response } from 'express';
// import prisma from '../config/prisma';
// import { HTTP_STATUS } from '../constants/httpStatus';

// // Tambahkan interface untuk type safety
// interface CreateReturPenjualanDto {
//   id_transaksi: number;
//   kd_brgdg: number;
//   detail?: string;
//   qty: number;
//   harga: number;
//   discount: number;
//   ppn: number;
//   subtotal_harga: number;
//   subtotal_discount: number;
//   subtotal_ppn: number;
//   no_batch?: string;
//   tgl_batch?: Date;
//   id_hretur_cabang?: number;
//   detail_retur_cabang?: string;
//   status_retur?: string;
//   nominal_retur?: number;
//   hpp: number;
//   total_hpp: number;
//   wso2transfer: boolean;
//   id_htransb: number;
// }

// export const returPenjualanController = {
//   async create(req: Request<{}, {}, CreateReturPenjualanDto>, res: Response) {
//     try {
//       const data = req.body;

//       // Konversi tipe data
//       const convertedData = {
//         ...data,
//         id_transaksi: Number(data.id_transaksi),
//         kd_brgdg: Number(data.kd_brgdg),
//         qty: Number(data.qty),
//         harga: Number(data.harga),
//         discount: Number(data.discount),
//         ppn: Number(data.ppn),
//         subtotal_harga: Number(data.subtotal_harga),
//         subtotal_discount: Number(data.subtotal_discount),
//         subtotal_ppn: Number(data.subtotal_ppn),
//         hpp: Number(data.hpp),
//         total_hpp: Number(data.total_hpp),
//         tgl_batch: data.tgl_batch ? new Date(data.tgl_batch) : undefined,
//       };

//       const newReturPenjualan: any = await prisma.retu.create({
//         data: convertedData,
//         include: {
//           transaksi: true,
//           mainstock: true,
//         },
//       });

//       return res.status(HTTP_STATUS.CREATED).json({
//         success: true,
//         message: 'Retur penjualan created successfully',
//         data: newReturPenjualan,
//       });
//     } catch (error) {
//       console.error('Error creating retur penjualan:', error);
//       return res.status(HTTP_STATUS.BAD_REQUEST).json({
//         success: false,
//         message: 'Failed to create new retur penjualan',
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   },

//   async getAll(req: Request, res: Response) {
//     try {
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 10;
//       const search = req.query.search as string;
//       const sortBy = req.query.sortBy as string || 'created_at';
//       const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';
//       const date = req.query.date as string;

//       const skip = (page - 1) * limit;

//       let where: any = {};

//       if (search) {
//         where.OR = [
//           { id: { equals: parseInt(search) } },
//           { id_transaksi: { equals: parseInt(search) } },
//           { mainstock: { nm_brgdg: { contains: search, mode: 'insensitive' } } },
//         ];
//       }

//       if (date) {
//         where.created_at = {
//           gte: new Date(`${date}T00:00:00Z`),
//           lt: new Date(`${date}T23:59:59Z`),
//         };
//       }

//       const [returPenjualans, totalCount] = await Promise.all([
//         prisma.ReturPenjualan.findMany({
//           where,
//           skip,
//           take: limit,
//           orderBy: { [sortBy]: sortOrder },
//           include: {
//             transaksi: true,
//             mainstock: {
//               select: {
//                 nm_brgdg: true,
//                 barcode: true,
//                 kategori: true,
//               },
//             },
//           },
//         }),
//         prisma.ReturPenjualan.count({ where }),
//       ]);
      
//       const formattedReturPenjualans = returPenjualans.map(r => ({
//         id: r.id,
//         tanggal_beli: r.transaksi.created_at.toISOString().split('T')[0],
//         no_bon: r.id_transaksi,
//         nama_barang: r.mainstock.nm_brgdg,
//         barcode: r.mainstock.barcode,
//         kategori: r.mainstock.kategori?.nm_kategori,
//         qty: r.qty,
//         harga: r.harga,
//         discount: r.discount,
//         ppn: r.ppn,
//         subtotal_harga: r.subtotal_harga,
//         status_retur: r.status_retur,
//         tanggal_retur: r.created_at.toISOString().split('T')[0],
//       }));

//       return res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: 'Retur penjualan list retrieved successfully',
//         data: formattedReturPenjualans,
//         meta: {
//           currentPage: page,
//           totalPages: Math.ceil(totalCount / limit),
//           totalCount,
//           limit,
//         },
//       });
//     } catch (error) {
//       console.error('Error fetching retur penjualan list:', error);
//       return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: 'Failed to fetch retur penjualan list',
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   },

//   async getById(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const returPenjualan = await prisma.ReturPenjualan.findUnique({
//         where: { id: Number(id) },
//         include: {
//           transaksi: true,
//           mainstock: {
//             include: {
//               kategori: true,
//             },
//           },
//         },
//       });

//       if (!returPenjualan) {
//         return res.status(HTTP_STATUS.NOT_FOUND).json({
//           success: false,
//           message: 'Retur penjualan not found',
//         });
//       }

//       return res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: 'Retur penjualan retrieved successfully',
//         data: returPenjualan,
//       });
//     } catch (error) {
//       console.error('Error fetching retur penjualan:', error);
//       return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: 'Failed to fetch retur penjualan',
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   },

//   async update(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const data = req.body;

//       // Konversi tipe data jika ada
//       const convertedData = {
//         ...data,
//         id_transaksi: data.id_transaksi ? Number(data.id_transaksi) : undefined,
//         kd_brgdg: data.kd_brgdg ? Number(data.kd_brgdg) : undefined,
//         qty: data.qty ? Number(data.qty) : undefined,
//         harga: data.harga ? Number(data.harga) : undefined,
//         discount: data.discount ? Number(data.discount) : undefined,
//         ppn: data.ppn ? Number(data.ppn) : undefined,
//         subtotal_harga: data.subtotal_harga ? Number(data.subtotal_harga) : undefined,
//         subtotal_discount: data.subtotal_discount ? Number(data.subtotal_discount) : undefined,
//         subtotal_ppn: data.subtotal_ppn ? Number(data.subtotal_ppn) : undefined,
//         hpp: data.hpp ? Number(data.hpp) : undefined,
//         total_hpp: data.total_hpp ? Number(data.total_hpp) : undefined,
//         tgl_batch: data.tgl_batch ? new Date(data.tgl_batch) : undefined,
//       };

//       const updatedReturPenjualan = await prisma.returPenjualan.update({
//         where: { id: Number(id) },
//         data: convertedData,
//         include: {
//           transaksi: true,
//           mainstock: {
//             include: {
//               kategori: true,
//             },
//           },
//         },
//       });

//       return res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: 'Retur penjualan updated successfully',
//         data: updatedReturPenjualan,
//       });
//     } catch (error) {
//       console.error('Error updating retur penjualan:', error);
//       return res.status(HTTP_STATUS.BAD_REQUEST).json({
//         success: false,
//         message: 'Failed to update retur penjualan',
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   },

//   async delete(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       await prisma.ReturPenjualan.delete({
//         where: { id: Number(id) },
//       });

//       return res.status(HTTP_STATUS.OK).json({
//         success: true,
//         message: 'Retur penjualan deleted successfully',
//       });
//     } catch (error) {
//       console.error('Error deleting retur penjualan:', error);
//       return res.status(HTTP_STATUS.BAD_REQUEST).json({
//         success: false,
//         message: 'Failed to delete retur penjualan',
//         error: error instanceof Error ? error.message : String(error),
//       });
//     }
//   },
// };