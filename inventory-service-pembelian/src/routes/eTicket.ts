import { Router } from 'express';
import {eTicketController} from '../controllers/eTicketController';

const router = Router();

router.post('/', eTicketController.create);
router.get('/', eTicketController.getAll);
router.put('/:id', eTicketController.update);
router.delete('/:id', eTicketController.delete);

export default router;
