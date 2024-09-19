"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpStatus_1 = require("../constants/httpStatus");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res
            .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: 'No authorization header provided' });
    }
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return res
            .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: 'Invalid authorization format' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res
            .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
            .json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
