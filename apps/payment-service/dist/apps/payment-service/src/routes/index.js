"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/payment-service/src/routes/paymentRoutes.ts
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
const paymentController = new controllers_1.PaymentController();
router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);
exports.default = router;
