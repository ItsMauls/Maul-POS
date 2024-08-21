import { Router } from 'express';
import supplierRoutes from './supplier';
import penerimaanRoutes from './penerimaan';
import fakturPembelianRoutes from './fakturPembelian';
import eTicketRoutes from './eTicket';
import suratPesananRoutes from './suratPesanan';

const router = Router();

router.use('/supplier', supplierRoutes);
// router.use('/penerimaan-cabang', penerimaanCabangRoutes);
router.use('/faktur-pembelian', fakturPembelianRoutes);
router.use('/e-ticket', eTicketRoutes);
router.use('/penerimaan', penerimaanRoutes);
router.use('/surat-pesanan', suratPesananRoutes);

export default router;
