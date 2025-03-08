"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenInfo = getTokenInfo;
exports.getVerifiedTokenInfo = getVerifiedTokenInfo;
const common_1 = require("@nestjs/common");
const extract_token_util_1 = require("./extract-token.util");
function getTokenInfo(request, jwtService) {
    try {
        const token = (0, extract_token_util_1.extractTokenFromHeader)(request);
        const payload = jwtService.verify(token);
        return {
            id: payload.id,
            email: payload.email,
            role: payload.role
        };
    }
    catch {
        throw new common_1.UnauthorizedException('Invalid or expired token');
    }
}
async function getVerifiedTokenInfo(request, sessionService) {
    try {
        const token = (0, extract_token_util_1.extractTokenFromHeader)(request);
        return await sessionService.verifySession(token);
    }
    catch {
        throw new common_1.UnauthorizedException('Invalid or expired token');
    }
}
//# sourceMappingURL=token-info.util.js.map