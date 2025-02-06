// apps/payment-service/src/controllers/PaymentController.ts
import { Request, Response } from 'express';
import prisma from '../config/prisma';

export class PaymentController {
    async createPayment(req: Request, res: Response) {
        try {
          const { transactionId, amount, paymentType, cashPayment, cardPayment } = req.body;
          
          // Validate payment amount
          if (paymentType === 'CASH' && cashPayment.amount < amount) {
            return res.status(401).json({ 
              error: 'Cash payment amount must be equal to or greater than total amount' 
            });
          }

          if ((paymentType === 'CREDIT' || paymentType === 'DEBIT') && cardPayment.amount < amount) {
            return res.status(401).json({ 
              error: 'Card payment amount must be equal to or greater than total amount' 
            });
          }
      
          const payment = await prisma.payment.create({
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
        } catch (error) {
          console.error('Error creating payment:', error);
          res.status(500).json({ error: 'Failed to create payment' });
    }
  }

  async getPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await prisma.payment.findUnique({
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
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve payment' });
    }
  }
}