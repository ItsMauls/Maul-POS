import { Router } from 'express';
import { transaksiPenjualanController } from '../controllers/transaksiPenjualanController';

const router = Router();

router.post('/', transaksiPenjualanController.create);
router.get('/', transaksiPenjualanController.getAll);
router.get('/:id', transaksiPenjualanController.getById);
router.put('/:id', transaksiPenjualanController.update);
router.delete('/:id', transaksiPenjualanController.delete);

export default router;