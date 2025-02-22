import { Router } from 'express';
import { CabangController } from '../controllers/cabang';

const router = Router();
const cabangController = new CabangController();

router.post('/create', cabangController.createKassa);
router.put('/:no_kassa', cabangController.updateKassa);
router.get('/current', cabangController.getBranchByMacAddress);
router.get('/:kd_cab/kassas', cabangController.getKassasByBranch);

export default router;
