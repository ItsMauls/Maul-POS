"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const signAccessToken = (userId) => jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
exports.signAccessToken = signAccessToken;
const signRefreshToken = (userId) => jsonwebtoken_1.default.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
exports.signRefreshToken = signRefreshToken;
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
