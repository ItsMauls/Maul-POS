import { Router } from 'express';
import {fakturPembelianController} from '../controllers/fakturPembelianController';

const router = Router();

router.post('/', fakturPembelianController.create);
router.get('/', fakturPembelianController.getAll);
router.put('/:id', fakturPembelianController.update);
router.delete('/:id', fakturPembelianController.delete);

export default router;
