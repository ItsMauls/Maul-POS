"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returPenjualanController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const httpStatus_1 = require("../constants/httpStatus");
const error_1 = require("../middlewares/error");
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
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
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
            const skip = (page - 1) * limit;
            const where = search ? {
                OR: [
                    { noRetur: { contains: search, mode: 'insensitive' } },
                    { keterangan: { contains: search, mode: 'insensitive' } },
                ],
            } : {};
            const [returPenjualans, totalCount] = await Promise.all([
                prisma_1.default.returPenjualan.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                }),
                prisma_1.default.returPenjualan.count({ where }),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json({
                success: true,
                message: 'Retur penjualan list retrieved successfully',
                data: returPenjualans,
                meta: {
                    currentPage: page,
                    totalPages,
                    totalCount,
                    limit,
                },
            });
        }
        catch (error) {
            console.log(error.message);
            throw (0, error_1.createError)('FETCH_RETUR_PENJUALAN_ERROR');
        }
    },
    async getById(req, res) {
        try {
            const { id } = req.params;
            const returPenjualan = await prisma_1.default.returPenjualan.findUnique({
                where: { id: Number(id) },
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
            throw (0, error_1.createError)('FETCH_RETUR_PENJUALAN_ERROR');
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
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
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
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to delete retur penjualan',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
};
