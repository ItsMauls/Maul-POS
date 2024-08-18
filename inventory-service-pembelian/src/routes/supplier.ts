import { Router } from 'express';
import { supplierController } from '../controllers/supplier';

const router = Router();

router.post('/', supplierController.create);
router.get('/', supplierController.getAll);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.delete);

export default router;
