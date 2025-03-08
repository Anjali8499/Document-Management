"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRedisValue = setRedisValue;
exports.getRedisValue = getRedisValue;
exports.deleteRedisValue = deleteRedisValue;
exports.checkRedisValue = checkRedisValue;
const ioredis_1 = require("ioredis");
const redis = new ioredis_1.default({ host: process.env.REDIS_HOST, port: parseInt(process.env.REDIS_PORT || '6379') });
async function setRedisValue(key, value, ttl) {
    if (ttl) {
        await redis.set(key, value, 'EX', ttl);
    }
    else {
        await redis.set(key, value);
    }
}
async function getRedisValue(key) {
    return await redis.get(key);
}
async function deleteRedisValue(key) {
    await redis.del(key);
}
async function checkRedisValue(key) {
    const value = await getRedisValue(key);
    return value !== null;
}
//# sourceMappingURL=redis.util.js.map