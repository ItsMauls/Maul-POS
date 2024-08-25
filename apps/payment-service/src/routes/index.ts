// apps/payment-service/src/routes/paymentRoutes.ts
import express from 'express';
import { PaymentController } from '../controllers';

const router = express.Router();
const paymentController = new PaymentController();

router.post('/', paymentController.createPayment);
router.get('/:id', paymentController.getPayment);

export default router;