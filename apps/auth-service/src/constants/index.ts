const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service-host:3006/api/users';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

export { JWT_SECRET, REFRESH_TOKEN_SECRET, USER_SERVICE_URL, REDIS_HOST, REDIS_PORT };