"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionTTL = exports.getAllSessions = exports.deleteSession = exports.getSession = exports.setSession = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("../constants");
const redis = new ioredis_1.default(constants_1.REDIS_HOST);
const setSession = (sessionId, data, expirationInSeconds) => redis.set(`session:${sessionId}`, JSON.stringify(data), 'EX', expirationInSeconds);
exports.setSession = setSession;
const getSession = (sessionId) => redis.get(`session:${sessionId}`);
exports.getSession = getSession;
const deleteSession = (sessionId) => redis.del(`session:${sessionId}`);
exports.deleteSession = deleteSession;
const getAllSessions = () => redis.keys('session:*');
exports.getAllSessions = getAllSessions;
const getSessionTTL = (sessionId) => redis.ttl(`session:${sessionId}`);
exports.getSessionTTL = getSessionTTL;
