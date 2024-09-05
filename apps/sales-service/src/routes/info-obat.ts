import { Router } from 'express';
import { infoObatController } from '../controllers/infoObatController';

const router = Router();

router.post('/', infoObatController.create);
router.get('/', infoObatController.getAll);
router.get('/:kd_brgdg', infoObatController.getById);
router.put('/:kd_brgdg', infoObatController.update);
router.delete('/:kd_brgdg', infoObatController.delete);

export default router;
