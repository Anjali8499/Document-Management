"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = extractTokenFromHeader;
exports.safeExtractTokenFromHeader = safeExtractTokenFromHeader;
const common_1 = require("@nestjs/common");
function extractTokenFromHeader(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new common_1.UnauthorizedException('Missing or invalid authorization token');
    }
    return authHeader.split(' ')[1];
}
function safeExtractTokenFromHeader(request) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
}
//# sourceMappingURL=extract-token.util.js.map