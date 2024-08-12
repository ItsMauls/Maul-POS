import { HTTP_STATUS } from './httpStatus';

export const ERROR_TYPES = {
  FETCH_OBAT_ERROR: {
    name: 'FetchObatError',
    message: 'Failed to fetch obat list',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
  },
  FETCH_RETUR_PENJUALAN_ERROR: {
    name: 'FetchReturPenjualanError',
    message: 'Failed to fetch retur penjualan list',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR
  },
  // Tambahkan error lain di sini
} as const;

export type ErrorType = keyof typeof ERROR_TYPES;
