"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returPenjualanController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const httpStatus_1 = require("../constants/httpStatus");
exports.returPenjualanController = {
    async create(req, res) {
        try {
            const newReturPenjualan = await prisma_1.default.returPenjualan.create({
                data: req.body,
            });
            res.status(httpStatus_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Retur penjualan created successfully',
                data: newReturPenjualan,
            });
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Failed to create new retur penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy || 'created_at';
            const sortOrder = req.query.sortOrder || 'desc';
            const date = req.query.date;
            const skip = (page - 1) * limit;
            let where = {};
            if (search) {
                where.OR = [
                    { id: { equals: parseInt(search) } },
                    { transaksi: { id: { equals: parseInt(search) } } },
                    { kd_brgdg: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (date) {
                where.created_at = {
                    gte: new Date(`${date}T00:00:00Z`),
                    lt: new Date(`${date}T23:59:59Z`),
                };
            }
            const [returPenjualans, totalCount] = await Promise.all([
                prisma_1.default.returPenjualan.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include: {
                        transaksi: true,
                        mainstock: true,
                    },
                }),
                prisma_1.default.returPenjualan.count({ where }),
            ]);
            const formattedReturPenjualans = returPenjualans.map((r) => ({
                id: r.id,
                tanggal_beli: r.transaksi.created_at.toISOString().split('T')[0],
                no_bon: r.transaksi.id,
                nama_barang: r.mainstock.nm_brgdg, // Assuming kd_brgdg represents the product name
                total: r.subtotal_harga,
                tanggal_retur: r.created_at.toISOString().split('T')[0],
            }));
            const totalPages = Math.ceil(totalCount / limit);
            res.status(httpStatus_1.HTTP_STATUS.OK).json({
                success: true,
                message: 'Retur penjualan list retrieved successfully',
                data: formattedReturPenjualans,
                meta: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                },
            });
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch retur penjualan list',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const returPenjualan = await prisma_1.default.returPenjualan.findUnique({
                where: { id: Number(id) },
                include: { transaksi: true },
            });
            if (returPenjualan) {
                res.status(httpStatus_1.HTTP_STATUS.OK).json({
                    success: true,
                    message: 'Retur penjualan retrieved successfully',
                    data: returPenjualan,
                });
            }
            else {
                res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Retur penjualan not found',
                });
            }
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch retur penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedReturPenjualan = await prisma_1.default.returPenjualan.update({
                where: { id: Number(id) },
                data: req.body,
            });
            res.status(httpStatus_1.HTTP_STATUS.OK).json({
                success: true,
                message: 'Retur penjualan updated successfully',
                data: updatedReturPenjualan,
            });
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Failed to update retur penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            await prisma_1.default.returPenjualan.delete({
                where: { id: Number(id) },
            });
            res.status(httpStatus_1.HTTP_STATUS.NO_CONTENT).json({
                success: true,
                message: 'Retur penjualan deleted successfully',
            });
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: 'Failed to delete retur penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
};
