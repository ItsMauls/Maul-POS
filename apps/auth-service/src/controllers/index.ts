import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import schedule from 'node-schedule';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { setSession, getSession, deleteSession, getAllSessions, getSessionTTL } from '../utils/redis';
import { HTTP_STATUS } from '../constants/httpStatus';
import userService from '../services/index';

export const authController = {
  async register(req: Request, res: Response) {
    const { email, password, username, phoneNumber } = req.body;

    try {
      const hashedPassword = await hashPassword(password);
      const user = await userService.createUser({ email, password: hashedPassword, username, phoneNumber });
      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
      console.log(error as any);
      
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ 
          error: 'Registration failed', 
          message: (error as any).message 
        });
    }
  },

  async login(req: Request, res: Response) {
    const { phoneNumber, password } = req.body;

    try {
      const user = await userService.findUserByPhoneNumber(phoneNumber);
      console.log(user, 'user');

      if (!user || !await comparePassword(password, user.password)) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: 'Invalid credentials' });
      }

      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      const sessionId = uuidv4();
      await setSession(sessionId, { userId: user.id, refreshToken }, 60 * 60 * 24 * 7); // 7 days

      res.json({ accessToken, refreshToken, sessionId });
    } catch (error) {
      console.error('Login error:', error);

      if ((error as any).code === 'ECONNREFUSED') {
        res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json({ 
            error: 'User service is unavailable', 
            message: 'Please try again later'
          });
      } else {
        res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json({ 
            error: 'Login failed', 
            message: (error as any).message || 'An unexpected error occurred'
          });
      }
    }
  },

  async refreshToken(req: Request, res: Response) {
    const { refreshToken, sessionId } = req.body;
    console.log('Refresh token:', refreshToken, 'Session ID:', sessionId);
  
    try {
      const session = await getSession(sessionId);
      console.log('Retrieved session:', session);
  
      if (!session) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: 'Invalid session' });
      }
  
      const { userId, refreshToken: storedRefreshToken } = JSON.parse(session);
      if (refreshToken !== storedRefreshToken) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: 'Invalid refresh token' });
      }
  
      verifyRefreshToken(refreshToken);
  
      const newAccessToken = signAccessToken(userId);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error in refreshToken:', error);
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ error: 'Invalid refresh token' });
    }
  },

  async logout(req: Request, res: Response) {
    const { sessionId } = req.body;

    try {
      await deleteSession(sessionId);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: 'Logout failed' });
    }
  },

  async changePassword(req: Request, res: Response) {
    const { userId, currentPassword, newPassword } = req.body;

    try {
      const user = await userService.findUserById(userId);
      if (!user || !await comparePassword(currentPassword, user.password)) {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ error: 'Invalid credentials' });
      }

      const hashedNewPassword = await hashPassword(newPassword);
      await userService.updateUserPassword(userId, hashedNewPassword);

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: 'Password change failed' });
    }
  }
};

// Schedule job to remove expired sessions
schedule.scheduleJob('0 0 * * *', async () => {
  const sessions = await getAllSessions();
  for (const sessionKey of sessions) {
    const ttl = await getSessionTTL(sessionKey);
    if (ttl <= 0) {
      await deleteSession(sessionKey);
    }
  }
});

export default authController;