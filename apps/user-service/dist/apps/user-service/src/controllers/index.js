"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const httpStatus_1 = require("../constants/httpStatus");
exports.userController = {
    // Get all users
    async getAllUsers(req, res) {
        try {
            const users = await prisma_1.default.user.findMany({
                select: { id: true, email: true, username: true, role: true, isActive: true }
            });
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    },
    // Get user by ID
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await prisma_1.default.user.findUnique({
                where: { id },
                include: { profile: true }
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching user' });
        }
    },
    // Create new user
    async createUser(req, res) {
        const { email, username, password, firstName, lastName } = req.body;
        try {
            const newUser = await prisma_1.default.user.create({
                data: { email, username, password, firstName, lastName }
            });
            res
                .status(httpStatus_1.HTTP_STATUS.CREATED)
                .json(newUser);
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ error: 'Error creating user' });
        }
    },
    // Update user
    async updateUser(req, res) {
        const { id } = req.params;
        const { email, username, firstName, lastName, isActive } = req.body;
        try {
            const updatedUser = await prisma_1.default.user.update({
                where: { id },
                data: { email, username, firstName, lastName, isActive }
            });
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json(updatedUser);
        }
        catch (error) {
            res.status(400).json({ error: 'Error updating user' });
        }
    },
    // Delete user
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await prisma_1.default.user.delete({ where: { id } });
            res
                .status(httpStatus_1.HTTP_STATUS.OK)
                .json({ message: 'User deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ error: 'Error deleting user' });
        }
    },
    // Find user by email
    async findUserByPhoneNumber(req, res) {
        const { phoneNumber: phone_number } = req.params;
        try {
            const user = await prisma_1.default.user.findUnique({
                where: { phone_number },
                select: { id: true, phone_number: true, username: true, password: true, role: true, isActive: true }
            });
            if (!user) {
                return res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
            }
            res.status(httpStatus_1.HTTP_STATUS.OK).json(user);
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching user' });
        }
    },
    // Validate user credentials
    async validateUserCredentials(req, res) {
        const { email, password } = req.body;
        try {
            const user = await prisma_1.default.user.findUnique({
                where: { email },
                select: { id: true, email: true, password: true }
            });
            if (!user) {
                return res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
            }
            // Note: In a real-world scenario, you should use a proper password hashing library
            const isPasswordValid = user.password === password;
            if (!isPasswordValid) {
                return res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
            }
            res.status(httpStatus_1.HTTP_STATUS.OK).json({ message: 'Credentials are valid' });
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error validating credentials' });
        }
    },
    // Update user password
    async updateUserPassword(req, res) {
        const { id } = req.params;
        const { password } = req.body;
        try {
            const updatedUser = await prisma_1.default.user.update({
                where: { id },
                data: { password },
                select: { id: true, email: true, username: true }
            });
            res.status(httpStatus_1.HTTP_STATUS.OK).json(updatedUser);
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.BAD_REQUEST).json({ error: 'Error updating user password' });
        }
    },
    async getCurrentUser(req, res) {
        console.log(req.user);
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(httpStatus_1.HTTP_STATUS.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const user = await prisma_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    phone_number: true
                }
            });
            if (!user) {
                return res.status(httpStatus_1.HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
            }
            res.status(httpStatus_1.HTTP_STATUS.OK).json(user);
        }
        catch (error) {
            res.status(httpStatus_1.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching current user' });
        }
    },
};
