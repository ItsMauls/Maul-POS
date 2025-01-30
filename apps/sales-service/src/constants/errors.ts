import { HTTP_STATUS } from './httpStatus';

export type ErrorType = 
  | 'UNAUTHORIZED'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'INSUFFICIENT_STOCK'
  | 'DATABASE_ERROR'
  | 'PRINTER_ERROR'
  | 'PDF_GENERATION_ERROR';

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
  UNAUTHORIZED: {
    name: 'UnauthorizedError',
    message: 'User is not authorized',
    statusCode: HTTP_STATUS.UNAUTHORIZED,
  },
  INVALID_INPUT: {
    name: 'InvalidInputError',
    message: 'Invalid input data provided',
    statusCode: HTTP_STATUS.BAD_REQUEST,
  },
  NOT_FOUND: {
    name: 'NotFoundError',
    message: 'Resource not found',
    statusCode: HTTP_STATUS.NOT_FOUND,
  },
  INSUFFICIENT_STOCK: {
    name: 'InsufficientStockError',
    message: 'Insufficient stock quantity',
    statusCode: HTTP_STATUS.BAD_REQUEST,
  },
  DATABASE_ERROR: {
    name: 'DatabaseError',
    message: 'Database operation failed',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  PRINTER_ERROR: {
    name: 'PrinterError',
    message: 'Failed to print receipt',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
  PDF_GENERATION_ERROR: {
    name: 'PdfGenerationError',
    message: 'Failed to generate PDF receipt',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  },
} as const;

// export type ErrorType = keyof typeof ERROR_TYPES;
