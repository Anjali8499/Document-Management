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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const session_service_1 = require("./session.service");
const token_info_util_1 = require("./utils/token-info.util");
let AuthController = class AuthController {
    jwtService;
    sessionService;
    constructor(jwtService, sessionService) {
        this.jwtService = jwtService;
        this.sessionService = sessionService;
    }
    async getBasicTokenInfo(request) {
        try {
            const tokenInfo = await (0, token_info_util_1.getTokenInfo)(request, this.jwtService);
            return { tokenInfo };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Token info error:', error);
            throw new common_1.InternalServerErrorException('Error retrieving token information');
        }
    }
    async getVerifiedTokenInfo(request) {
        try {
            const tokenInfo = await (0, token_info_util_1.getVerifiedTokenInfo)(request, this.sessionService);
            return { tokenInfo };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Token info error:', error);
            throw new common_1.InternalServerErrorException('Error retrieving token information');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('token-info/basic'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token information retrieved successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBasicTokenInfo", null);
__decorate([
    (0, common_1.Get)('token-info/verified'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verified token information retrieved successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getVerifiedTokenInfo", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        session_service_1.SessionService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map