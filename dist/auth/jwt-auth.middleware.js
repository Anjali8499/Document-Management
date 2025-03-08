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
exports.JwtAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const session_service_1 = require("./session.service");
const extract_token_util_1 = require("./utils/extract-token.util");
let JwtAuthMiddleware = class JwtAuthMiddleware {
    sessionService;
    constructor(sessionService) {
        this.sessionService = sessionService;
    }
    async use(req, res, next) {
        try {
            const token = (0, extract_token_util_1.extractTokenFromHeader)(req);
            const payload = await this.sessionService.verifySession(token);
            req['user'] = payload;
            req['token'] = token;
            next();
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                next(error);
            }
            else {
                next(new common_1.UnauthorizedException('Invalid or expired token'));
            }
        }
    }
};
exports.JwtAuthMiddleware = JwtAuthMiddleware;
exports.JwtAuthMiddleware = JwtAuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [session_service_1.SessionService])
], JwtAuthMiddleware);
//# sourceMappingURL=jwt-auth.middleware.js.map