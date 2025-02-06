import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import userService from '../../../apps/auth-service/src/services';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'No authorization header provided' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ error: 'Invalid authorization format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    console.log(decoded.userId, 'decoded');
    
    const user = await userService.findUserById(decoded.userId);
    // console.log(user, 'user');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('error', error);
    
    return res
      .status(401)
      .json({ error: 'Invalid token' });
  }
};