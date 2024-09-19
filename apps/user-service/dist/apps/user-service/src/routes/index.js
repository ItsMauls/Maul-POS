"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const authenticate_1 = require("../../../../libs/@auth/src/authenticate");
const router = express_1.default.Router();
router.get('/current-user', authenticate_1.authenticate, controllers_1.userController.getCurrentUser);
router.get('/', controllers_1.userController.getAllUsers);
router.get('/:id', controllers_1.userController.getUserById);
router.post('/', controllers_1.userController.createUser);
router.put('/:id', controllers_1.userController.updateUser);
router.delete('/:id', controllers_1.userController.deleteUser);
router.post('/validate-credentials', controllers_1.userController.validateUserCredentials);
router.patch('/:id/password', controllers_1.userController.updateUserPassword);
router.get('/by-phone-number/:phoneNumber', controllers_1.userController.findUserByPhoneNumber);
exports.default = router;
