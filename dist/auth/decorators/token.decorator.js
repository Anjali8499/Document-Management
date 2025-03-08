"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const common_1 = require("@nestjs/common");
const extract_token_util_1 = require("../utils/extract-token.util");
exports.Token = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return (0, extract_token_util_1.extractTokenFromHeader)(request);
});
//# sourceMappingURL=token.decorator.js.map