import express from 'express';
import { antrianController } from '../controllers/antrianController';

const router = express.Router();

router.post('/add', antrianController.tambahAntrian);
router.put('/finish/:idAntrian', antrianController.selesaikanAntrian);
router.post('/continue', antrianController.continueAntrian)
router.get('/today/:kdCab', antrianController.getAntrianHariIni);
router.get('/current-antrian-info/:kdCab', antrianController.getCurrentAntrianInfo);

export default router;
