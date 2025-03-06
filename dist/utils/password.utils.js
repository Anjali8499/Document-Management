"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePasswords = comparePasswords;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, 10);
    }
    catch (error) {
        console.error('Failed to hash password:', error);
        throw new common_1.InternalServerErrorException('Failed to hash password');
    }
}
async function comparePasswords(plainTextPassword, hashedPassword) {
    try {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
    catch (error) {
        console.error('Failed to compare passwords:', error);
        throw new common_1.InternalServerErrorException('Failed to compare passwords');
    }
}
//# sourceMappingURL=password.utils.js.map