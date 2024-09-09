"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const userService = {
    async findUserByPhoneNumber(phoneNumber) {
        const response = await axios_1.default.get(`${constants_1.USER_SERVICE_URL}/by-phone-number/${phoneNumber}`);
        return response.data;
    },
    async validateUserCredentials(email, password) {
        const response = await axios_1.default.post(`${constants_1.USER_SERVICE_URL}/validate`, { email, password });
        return response.data;
    },
    async createUser(userData) {
        const response = await axios_1.default.post(`${constants_1.USER_SERVICE_URL}/`, userData);
        return response.data;
    },
    async findUserById(userId) {
        const response = await axios_1.default.get(`${constants_1.USER_SERVICE_URL}/${userId}`);
        return response.data;
    },
    async updateUserPassword(userId, newPassword) {
        const response = await axios_1.default.patch(`${constants_1.USER_SERVICE_URL}/users/${userId}/password`, { password: newPassword });
        return response.data;
    }
};
exports.default = userService;
