import { Router } from 'express';
import { suratPesananController } from '../controllers/suratPesananController';

const router = Router();

router.post('/', suratPesananController.create);
router.get('/', suratPesananController.getAll);
router.put('/:id', suratPesananController.update);
router.delete('/:id', suratPesananController.delete);

export default router;
