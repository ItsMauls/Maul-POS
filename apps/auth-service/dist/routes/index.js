"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = __importDefault(require("../controllers"));
const router = express_1.default.Router();
router.post('/register', controllers_1.default.register);
router.post('/login', controllers_1.default.login);
router.post('/refresh-token', controllers_1.default.refreshToken);
router.post('/logout', controllers_1.default.logout);
router.post('/change-password', controllers_1.default.changePassword);
exports.default = router;
