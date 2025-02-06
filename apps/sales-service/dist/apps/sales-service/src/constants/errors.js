"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_TYPES = void 0;
const httpStatus_1 = require("./httpStatus");
exports.ERROR_TYPES = {
    FETCH_OBAT_ERROR: {
        name: 'FetchObatError',
        message: 'Failed to fetch obat list',
        statusCode: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR
    },
    FETCH_RETUR_PENJUALAN_ERROR: {
        name: 'FetchReturPenjualanError',
        message: 'Failed to fetch retur penjualan list',
        statusCode: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR
    },
    UNAUTHORIZED: {
        name: 'UnauthorizedError',
        message: 'User is not authorized',
        statusCode: httpStatus_1.HTTP_STATUS.UNAUTHORIZED,
    },
    INVALID_INPUT: {
        name: 'InvalidInputError',
        message: 'Invalid input data provided',
        statusCode: httpStatus_1.HTTP_STATUS.BAD_REQUEST,
    },
    NOT_FOUND: {
        name: 'NotFoundError',
        message: 'Resource not found',
        statusCode: httpStatus_1.HTTP_STATUS.NOT_FOUND,
    },
    INSUFFICIENT_STOCK: {
        name: 'InsufficientStockError',
        message: 'Insufficient stock quantity',
        statusCode: httpStatus_1.HTTP_STATUS.BAD_REQUEST,
    },
    DATABASE_ERROR: {
        name: 'DatabaseError',
        message: 'Database operation failed',
        statusCode: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
    PRINTER_ERROR: {
        name: 'PrinterError',
        message: 'Failed to print receipt',
        statusCode: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
    PDF_GENERATION_ERROR: {
        name: 'PdfGenerationError',
        message: 'Failed to generate PDF receipt',
        statusCode: httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
};
// export type ErrorType = keyof typeof ERROR_TYPES;
