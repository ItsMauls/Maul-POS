import { Router } from 'express';
import infoObatRoutes from './info-obat';
import transaksiPenjualanRoutes from './transaksi-penjualan';
import returPenjualanRoutes from './retur-penjualan';   
import antrianRoutes from './antrian';

const router = Router();

router.use('/info-obat', infoObatRoutes);
router.use('/antrian', antrianRoutes);
router.use('/transaksi-penjualan', transaksiPenjualanRoutes);
router.use('/retur-penjualan', returPenjualanRoutes);


export default router;
