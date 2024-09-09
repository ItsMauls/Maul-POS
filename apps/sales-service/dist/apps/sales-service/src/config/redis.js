"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.connectRedis = connectRedis;
exports.disconnectRedis = disconnectRedis;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});
exports.redis = redisClient;
redisClient.on('error', (err) => console.log('Redis Client Error', err));
async function connectRedis() {
    await redisClient.connect();
}
async function disconnectRedis() {
    await redisClient.disconnect();
}
