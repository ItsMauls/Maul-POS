"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.infoObatController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const httpStatus_1 = require("../constants/httpStatus");
exports.infoObatController = {
    async create(req, res) {
        try {
            const newObat = await prisma_1.default.mainstock.create({
                data: req.body,
            });
            res.status(httpStatus_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Obat created successfully',
                data: newObat,
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to create new obat',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy || 'nm_brgdg';
            const sortOrder = req.query.sortOrder || 'asc';
            const kategori = parseInt(req.query.kategori) || undefined;
            const skip = (page - 1) * limit;
            const where = {
                AND: [
                    search ? {
                        OR: [
                            { nm_brgdg: { contains: search, mode: 'insensitive' } },
                            { barcode: { contains: search, mode: 'insensitive' } },
                        ],
                    } : {},
                    kategori ? { id_kategori: kategori } : {},
                ],
            };
            const [obatList, totalCount] = await Promise.all([
                prisma_1.default.mainstock.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include: { category: true },
                }),
                prisma_1.default.mainstock.count({ where }),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json({
                success: true,
                message: 'Obat list retrieved successfully',
                data: obatList,
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
                message: 'Failed to fetch obat list',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async update(req, res) {
        try {
            const { kd_brgdg } = req.params;
            const updatedObat = await prisma_1.default.mainstock.update({
                where: { kd_brgdg: parseInt(kd_brgdg) },
                data: req.body,
            });
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json({
                success: true,
                message: 'Obat updated successfully',
                data: updatedObat,
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to update obat',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async delete(req, res) {
        try {
            const { kd_brgdg } = req.params;
            await prisma_1.default.mainstock.delete({
                where: { kd_brgdg: parseInt(kd_brgdg) },
            });
            res
                .status(httpStatus_1.HTTP_STATUS.NO_CONTENT)
                .json({
                success: true,
                message: 'Obat deleted successfully',
            });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                success: false,
                message: 'Failed to delete obat',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
};
