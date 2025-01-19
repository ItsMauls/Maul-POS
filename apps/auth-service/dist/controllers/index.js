"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const uuid_1 = require("uuid");
const node_schedule_1 = __importDefault(require("node-schedule"));
const jwt_1 = require("../utils/jwt");
const bcrypt_1 = require("../utils/bcrypt");
const redis_1 = require("../utils/redis");
const httpStatus_1 = require("../constants/httpStatus");
const index_1 = __importDefault(require("../services/index"));
exports.authController = {
    async register(req, res) {
        const { email, password, username, phoneNumber } = req.body;
        try {
            const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
            const user = await index_1.default.createUser({ email, password: hashedPassword, username, phoneNumber });
            res
                .status(httpStatus_1.HTTP_STATUS.CREATED)
                .json({ message: 'User registered successfully', userId: user.id });
        }
        catch (error) {
            console.log(error);
            res
                .status(httpStatus_1.HTTP_STATUS.BAD_REQUEST)
                .json({
                error: 'Registration failed',
                message: error.message
            });
        }
    },
    async login(req, res) {
        const { phoneNumber, password } = req.body;
        try {
            const user = await index_1.default.findUserByPhoneNumber(phoneNumber);
            console.log(user, 'user');
            if (!user || !await (0, bcrypt_1.comparePassword)(password, user.password)) {
                return res
                    .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                    .json({ error: 'Invalid credentials' });
            }
            const accessToken = (0, jwt_1.signAccessToken)(user.id);
            const refreshToken = (0, jwt_1.signRefreshToken)(user.id);
            const sessionId = (0, uuid_1.v4)();
            await (0, redis_1.setSession)(sessionId, { userId: user.id, refreshToken }, 60 * 60 * 24 * 7); // 7 days
            res.json({ accessToken, refreshToken, sessionId });
        }
        catch (error) {
            console.error('Login error:', error);
            if (error.code === 'ECONNREFUSED') {
                res
                    .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json({
                    error: 'User service is unavailable',
                    message: 'Please try again later'
                });
            }
            else {
                res
                    .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                    .json({
                    error: 'Login failed',
                    message: error.message || 'An unexpected error occurred'
                });
            }
        }
    },
    async refreshToken(req, res) {
        const { refreshToken, sessionId } = req.body;
        console.log('Refresh token:', refreshToken, 'Session ID:', sessionId);
        try {
            const session = await (0, redis_1.getSession)(sessionId);
            console.log('Retrieved session:', session);
            if (!session) {
                return res
                    .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                    .json({ error: 'Invalid session' });
            }
            const { userId, refreshToken: storedRefreshToken } = JSON.parse(session);
            if (refreshToken !== storedRefreshToken) {
                return res
                    .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                    .json({ error: 'Invalid refresh token' });
            }
            (0, jwt_1.verifyRefreshToken)(refreshToken);
            const newAccessToken = (0, jwt_1.signAccessToken)(userId);
            res.json({ accessToken: newAccessToken });
        }
        catch (error) {
            console.error('Error in refreshToken:', error);
            res
                .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                .json({ error: 'Invalid refresh token' });
        }
    },
    async logout(req, res) {
        const { sessionId } = req.body;
        try {
            await (0, redis_1.deleteSession)(sessionId);
            res.json({ message: 'Logged out successfully' });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ error: 'Logout failed' });
        }
    },
    async changePassword(req, res) {
        const { userId, currentPassword, newPassword } = req.body;
        try {
            const user = await index_1.default.findUserById(userId);
            if (!user || !await (0, bcrypt_1.comparePassword)(currentPassword, user.password)) {
                return res
                    .status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED)
                    .json({ error: 'Invalid credentials' });
            }
            const hashedNewPassword = await (0, bcrypt_1.hashPassword)(newPassword);
            await index_1.default.updateUserPassword(userId, hashedNewPassword);
            res.json({ message: 'Password changed successfully' });
        }
        catch (error) {
            res
                .status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
                .json({ error: 'Password change failed' });
        }
    }
};
// Schedule job to remove expired sessions
node_schedule_1.default.scheduleJob('0 0 * * *', async () => {
    const sessions = await (0, redis_1.getAllSessions)();
    for (const sessionKey of sessions) {
        const ttl = await (0, redis_1.getSessionTTL)(sessionKey);
        if (ttl <= 0) {
            await (0, redis_1.deleteSession)(sessionKey);
        }
    }
});
exports.default = exports.authController;
