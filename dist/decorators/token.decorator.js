"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalToken = exports.Token = void 0;
const common_1 = require("@nestjs/common");
const token_util_1 = require("../utils/token.util");
exports.Token = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.token) {
        return request.token;
    }
    const authHeader = request.headers.authorization;
    const token = (0, token_util_1.extractTokenFromHeader)(authHeader);
    if (!token) {
        throw new common_1.UnauthorizedException('Missing or invalid authorization token');
    }
    return token;
});
exports.OptionalToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request.token) {
        return request.token;
    }
    const authHeader = request.headers.authorization;
    return (0, token_util_1.extractTokenFromHeader)(authHeader);
});
//# sourceMappingURL=token.decorator.js.map