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
    // Tambahkan error lain di sini
};
