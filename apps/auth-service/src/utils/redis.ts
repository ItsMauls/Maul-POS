import Redis from 'ioredis';
import { REDIS_HOST } from '../constants';

const redis = new Redis(REDIS_HOST);

export const setSession = (sessionId: string, data: object, expirationInSeconds: number) => 
  redis.set(`session:${sessionId}`, JSON.stringify(data), 'EX', expirationInSeconds);

export const getSession = (sessionId: string) => redis.get(`session:${sessionId}`);
export const deleteSession = (sessionId: string) => redis.del(`session:${sessionId}`);
export const getAllSessions = () => redis.keys('session:*');
export const getSessionTTL = (sessionId: string) => redis.ttl(`session:${sessionId}`);