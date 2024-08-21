import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';
import { ERROR_TYPES, ErrorType } from '../constants/errors';

interface CustomError extends Error {
  name: string;
  statusCode?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const errorName = err.name || 'InternalServerError';

  const errorResponse = {
    success: false,
    message: err.message || 'An unexpected error occurred',
    error: errorName,
  };

  res.status(statusCode).json(errorResponse);
};

export const createError = (errorType: ErrorType): CustomError => {
  const { name, message, statusCode } = ERROR_TYPES[errorType];
  const error: CustomError = new Error(message);
  error.name = name;
  error.statusCode = statusCode;
  return error;
};

export default errorMiddleware;
