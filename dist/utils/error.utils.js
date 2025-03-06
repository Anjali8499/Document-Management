"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserError = handleUserError;
const common_1 = require("@nestjs/common");
function handleUserError(error, defaultMessage) {
    if (error instanceof common_1.ConflictException ||
        error instanceof common_1.InternalServerErrorException) {
        return error;
    }
    return new common_1.InternalServerErrorException(defaultMessage);
}
//# sourceMappingURL=error.utils.js.map