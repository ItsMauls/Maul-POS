import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';

export const signAccessToken = (userId: string) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
export const signRefreshToken = (userId: string) => jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_TOKEN_SECRET);
