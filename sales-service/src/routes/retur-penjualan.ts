import { Router } from 'express';
import { returPenjualanController } from '../controllers/returPenjualanController';


const router = Router();

router.post('/', returPenjualanController.create);
router.get('/', returPenjualanController.getAll);
router.get('/:id', returPenjualanController.getById);
router.put('/:id', returPenjualanController.update);
router.delete('/:id', returPenjualanController.delete);

export default router;
