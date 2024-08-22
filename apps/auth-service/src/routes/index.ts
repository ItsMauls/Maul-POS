import express from 'express';
import authController from '../controllers';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/change-password', authController.changePassword);

export default router;