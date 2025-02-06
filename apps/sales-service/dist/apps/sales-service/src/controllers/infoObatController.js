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
            const obatData = req.body;
            // Perform type conversions
            if (typeof obatData.strip === 'string')
                obatData.strip = parseInt(obatData.strip, 10);
            if (typeof obatData.id_kategori === 'string')
                obatData.id_kategori = parseInt(obatData.id_kategori, 10);
            if (typeof obatData.id_pabrik === 'string')
                obatData.id_pabrik = parseInt(obatData.id_pabrik, 10);
            if (typeof obatData.hj_bbs === 'string')
                obatData.hj_bbs = parseFloat(obatData.hj_bbs);
            // Validate required fields
            if (!obatData.nm_brgdg || !obatData.strip) {
                throw new Error('nm_brgdg and strip are required fields');
            }
            // Separate id_kategori from the rest of the data
            const { id_kategori, ...mainStockData } = obatData;
            const newObat = await prisma_1.default.tMainStock.create({
                data: {
                    nm_brgdg: obatData.nm_brgdg,
                    strip: obatData.strip,
                    kd_cab: "DEFAULT",
                    ...mainStockData,
                    id_kategori: id_kategori || null,
                },
            });
            console.log('New obat created:', newObat);
            res.status(httpStatus_1.HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Obat created successfully',
                data: newObat,
            });
        }
        catch (error) {
            console.error('Error creating obat:', error);
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json({
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
                            { barcode: { equals: search } },
                        ],
                    } : {},
                    kategori ? { id_kategori: kategori } : {},
                ],
            };
            const currentDate = new Date();
            const [obatList, totalCount] = await Promise.all([
                prisma_1.default.tMainStock.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include: {
                        kategori: true,
                    },
                }),
                prisma_1.default.tMainStock.count({ where }),
            ]);
            const processedObatList = obatList.map((obat) => {
                return Object.fromEntries(Object.entries(obat).map(([key, value]) => [
                    key,
                    typeof value === 'number' ? Math.round(value) : value
                ]));
            });
            const totalPages = Math.ceil(totalCount / limit);
            res.status(httpStatus_1.HTTP_STATUS.OK).json({
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
        }
        catch (error) {
            console.log(error instanceof Error ? error.message : String(error));
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch obat list',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
    async update(req, res) {
        try {
            const { kd_brgdg } = req.params;
            const updatedObat = await prisma_1.default.tMainStock.update({
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
            await prisma_1.default.tMainStock.delete({
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
    async getById(req, res) {
        try {
            const { kd_brgdg } = req.params;
            const obat = await prisma_1.default.tMainStock.findUnique({
                where: { kd_brgdg: parseInt(kd_brgdg) },
                include: {
                    kategori: true,
                },
            });
            if (!obat) {
                return res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: 'Obat not found',
                });
            }
            const processedObat = {};
            res.status(httpStatus_1.HTTP_STATUS.OK).json({
                success: true,
                message: 'Obat retrieved successfully',
                data: processedObat,
            });
        }
        catch (error) {
            console.error('Error fetching obat:', error);
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Failed to fetch obat',
                error: error instanceof Error ? error.message : String(error),
            });
        }
    },
};
