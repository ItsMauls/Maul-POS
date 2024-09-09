import express from 'express';
import { userController } from '../controllers';
import { authenticate } from '@auth/authenticate';

const router = express.Router();

router.get('/current-user', authenticate, userController.getCurrentUser);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/validate-credentials', userController.validateUserCredentials);
router.patch('/:id/password', userController.updateUserPassword);
router.get('/by-phone-number/:phoneNumber', userController.findUserByPhoneNumber);

export default router;