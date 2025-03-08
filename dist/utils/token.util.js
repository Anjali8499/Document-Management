"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
exports.verifyToken = verifyToken;
exports.storeUserSession = storeUserSession;
exports.getUserSession = getUserSession;
exports.removeUserSession = removeUserSession;
exports.blacklistToken = blacklistToken;
exports.isTokenBlacklisted = isTokenBlacklisted;
exports.extractTokenFromHeader = extractTokenFromHeader;
exports.getTokenExpirationTime = getTokenExpirationTime;
const common_1 = require("@nestjs/common");
const redis_util_1 = require("./redis.util");
function createToken(payload, jwtService, expiresIn = '24h') {
    return jwtService.sign(payload, { expiresIn });
}
function verifyToken(token, jwtService) {
    try {
        return jwtService.verify(token);
    }
    catch (error) {
        throw new common_1.UnauthorizedException('Invalid or expired token');
    }
}
async function storeUserSession(userId, userData, ttl = 86400) {
    const key = `user_session:${userId}`;
    await (0, redis_util_1.setRedisValue)(key, JSON.stringify(userData), ttl);
}
async function getUserSession(userId) {
    const key = `user_session:${userId}`;
    const data = await (0, redis_util_1.getRedisValue)(key);
    if (!data) {
        return null;
    }
    try {
        return JSON.parse(data);
    }
    catch (error) {
        console.error('Error parsing user session data:', error);
        return null;
    }
}
async function removeUserSession(userId) {
    const key = `user_session:${userId}`;
    await (0, redis_util_1.deleteRedisValue)(key);
}
async function blacklistToken(token, ttl) {
    const key = `blacklisted_token:${token}`;
    await (0, redis_util_1.setRedisValue)(key, '1', ttl);
}
async function isTokenBlacklisted(token) {
    const key = `blacklisted_token:${token}`;
    const value = await (0, redis_util_1.getRedisValue)(key);
    return value !== null;
}
function extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
}
function getTokenExpirationTime(token) {
    try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (decoded && typeof decoded.exp === 'number') {
            const now = Math.floor(Date.now() / 1000);
            return Math.max(decoded.exp - now, 0);
        }
    }
    catch (error) {
        console.error('Error decoding token:', error);
    }
    return 0;
}
//# sourceMappingURL=token.util.js.map