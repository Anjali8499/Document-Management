"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let TokenBlacklistService = class TokenBlacklistService {
    jwtService;
    blacklistedTokens = new Map();
    constructor(jwtService) {
        this.jwtService = jwtService;
        setInterval(() => this.removeExpiredTokens(), 60 * 60 * 1000);
    }
    async blacklistToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && typeof decoded === 'object' && decoded.exp) {
                const expiresAt = new Date(decoded.exp * 1000);
                this.blacklistedTokens.set(token, expiresAt);
                console.log(`Token blacklisted until ${expiresAt}`);
            }
        }
        catch (error) {
            console.error('Error blacklisting token:', error);
        }
    }
    isBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }
    removeExpiredTokens() {
        const now = new Date();
        for (const [token, expiresAt] of this.blacklistedTokens.entries()) {
            if (expiresAt <= now) {
                this.blacklistedTokens.delete(token);
            }
        }
        console.log(`Cleaned up blacklist. Current size: ${this.blacklistedTokens.size}`);
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map