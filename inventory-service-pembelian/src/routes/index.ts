import { Router } from 'express';
import supplierRoutes from './supplier';
import penerimaanCabangRoutes from './penerimaan-cabang';
import penerimaanSupplierRoutes from './penerimaan-supplier';

const router = Router();

router.use('/supplier', supplierRoutes);
router.use('/penerimaan-cabang', penerimaanCabangRoutes);
router.use('/penerimaan-supplier', penerimaanSupplierRoutes);

export default router;
