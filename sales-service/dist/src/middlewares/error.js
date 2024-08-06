"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const errors_1 = require("../constants/errors");
const errorMiddleware = (err, req, res) => {
    const statusCode = err.statusCode || httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const errorName = err.name || 'InternalServerError';
    const errorResponse = {
        success: false,
        message: err.message || 'An unexpected error occurred',
        error: errorName,
    };
    res.status(statusCode).json(errorResponse);
};
const createError = (errorType) => {
    const { name, message, statusCode } = errors_1.ERROR_TYPES[errorType];
    const error = new Error(message);
    error.name = name;
    error.statusCode = statusCode;
    return error;
};
exports.createError = createError;
exports.default = errorMiddleware;
