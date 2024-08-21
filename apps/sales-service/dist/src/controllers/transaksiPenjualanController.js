"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transaksiPenjualanController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const httpStatus_1 = require("../constants/httpStatus");
exports.transaksiPenjualanController = {
    async create(req, res) {
        try {
            const newTransaksi = await prisma_1.default.transaksiPenjualan.create({
                data: req.body,
            });
            res.status(httpStatus_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Transaksi penjualan created successfully',
                data: newTransaksi,
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to create new transaksi penjualan',
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
            const skip = (page - 1) * limit;
            const where = search ? {
                OR: [
                    { noFaktur: { contains: search, mode: 'insensitive' } },
                    { namaPelanggan: { contains: search, mode: 'insensitive' } },
                ],
            } : {};
            const [transaksiList, totalCount] = await Promise.all([
                prisma_1.default.transaksiPenjualan.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    //   include: { items: true },
                }),
                prisma_1.default.transaksiPenjualan.count({ where }),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json({
                success: true,
                message: 'Transaksi penjualan list retrieved successfully',
                data: transaksiList,
                meta: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                },
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({
                success: false,
                message: 'Failed to fetch transaksi penjualan list',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const transaksi = await prisma_1.default.transaksiPenjualan.findUnique({
                where: { id: parseInt(id) },
                include: { items: true },
            });
            if (!transaksi) {
                return res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Transaksi penjualan not found',
                });
            }
            res.status(httpStatus_1.HTTP_STATUS.OK).json({
                success: true,
                message: 'Transaksi penjualan retrieved successfully',
                data: transaksi,
            });
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch transaksi penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const updatedTransaksi = await prisma_1.default.transaksiPenjualan.update({
                where: { id: parseInt(id) },
                data: req.body,
            });
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json({
                success: true,
                message: 'Transaksi penjualan updated successfully',
                data: updatedTransaksi,
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to update transaksi penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            await prisma_1.default.transaksiPenjualan.delete({
                where: { id: parseInt(id) },
            });
            res
                .status(httpStatus_1.HTTP_STATUS.NO_CONTENT)
                .json({
                success: true,
                message: 'Transaksi penjualan deleted successfully',
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to delete transaksi penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
};
