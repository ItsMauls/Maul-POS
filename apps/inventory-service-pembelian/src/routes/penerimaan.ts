import { Router } from 'express';
import { penerimaanController } from '../controllers/penerimaanController';

const router = Router();

router.post('/', penerimaanController.create);
router.get('/', penerimaanController.getAll);
router.put('/:id', penerimaanController.update);
router.delete('/:id', penerimaanController.delete);

export default router;
