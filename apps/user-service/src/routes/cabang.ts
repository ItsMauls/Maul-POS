import { Router } from 'express';
import { CabangController } from '../controllers/cabang';

const cabangController = new CabangController();

const router = Router();

router.post('/', cabangController.createBranch);
router.get('/', cabangController.getAllBranches);
router.get('/:kd_cab', cabangController.getBranchByCode);
router.put('/:kd_cab', cabangController.updateBranch);
router.delete('/:kd_cab', cabangController.deleteBranch);


export default router;