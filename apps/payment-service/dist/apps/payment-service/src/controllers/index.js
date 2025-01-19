"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class PaymentController {
    async createPayment(req, res) {
        try {
            const { transactionId, amount, paymentType, cashPayment, cardPayment } = req.body;
            const payment = await prisma_1.default.payment.create({
                data: {
                    transactionId,
                    amount,
                    paymentType,
                    ...(paymentType === 'CASH' && {
                        cashPayment: { create: cashPayment }
                    }),
                    ...((paymentType === 'CREDIT' || paymentType === 'DEBIT') && {
                        cardPayment: { create: cardPayment }
                    }),
                },
                include: {
                    cashPayment: true,
                    cardPayment: true,
                },
            });
            res.status(201).json(payment);
        }
        catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ error: 'Failed to create payment' });
        }
    }
    async getPayment(req, res) {
        try {
            const { id } = req.params;
            const payment = await prisma_1.default.payment.findUnique({
                where: { id },
                include: {
                    cashPayment: true,
                    cardPayment: true,
                },
            });
            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.json(payment);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to retrieve payment' });
        }
    }
}
exports.PaymentController = PaymentController;
