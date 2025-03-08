"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const user = ctx.switchToHttp().getRequest();
    if (!user) {
        throw new common_1.UnauthorizedException('User is not authenticated');
    }
    return user;
});
//# sourceMappingURL=current-user.decorator.js.map