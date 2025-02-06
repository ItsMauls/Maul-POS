import { Router } from 'express';
import { transaksiPenjualanController } from '../controllers/transaksiPenjualanController';

const router = Router();

router.post('/', transaksiPenjualanController.createTransaction);
router.get('/', transaksiPenjualanController.getAll);

router.post('/tunda', transaksiPenjualanController.tundaTransaction);
router.get('/keranjang', transaksiPenjualanController.getKeranjang);

router.get('/:id', transaksiPenjualanController.getById);
router.put('/:id', transaksiPenjualanController.update);
router.delete('/:id', transaksiPenjualanController.delete);

export default router;