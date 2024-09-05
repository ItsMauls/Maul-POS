import { Router } from 'express';
import { createPromo, getPromos } from '../controllers/promoController';

const router = Router();

router.post('/', createPromo);
router.get('/', getPromos);

export default router;
