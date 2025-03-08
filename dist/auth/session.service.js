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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const auth_entity_1 = require("./auth.entity");
const auth_service_1 = require("./auth.service");
let SessionService = class SessionService {
    sessionRepository;
    jwtService;
    authService;
    constructor(sessionRepository, jwtService, authService) {
        this.sessionRepository = sessionRepository;
        this.jwtService = jwtService;
        this.authService = authService;
        setInterval(() => {
            void this.cleanupExpiredSessions();
        }, 60 * 60 * 1000);
    }
    async createSession(user) {
        const token = this.authService.generateJwtToken(user);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const session = this.sessionRepository.create({
            userId: user.id,
            token,
            expiresAt,
            isActive: true,
        });
        await this.sessionRepository.save(session);
        return token;
    }
    async findActiveSessionsByUserId(userId) {
        return this.sessionRepository.find({
            where: {
                userId,
                isActive: true,
                expiresAt: (0, typeorm_2.MoreThanOrEqual)(new Date())
            }
        });
    }
    async invalidateSession(token) {
        const session = await this.sessionRepository.findOne({ where: { token } });
        if (session) {
            session.isActive = false;
            await this.sessionRepository.save(session);
        }
    }
    async invalidateAllSessionsForUser(userId) {
        const result = await this.sessionRepository.update({
            userId,
            isActive: true
        }, {
            isActive: false
        });
        return result.affected || 0;
    }
    async verifySession(token) {
        try {
            const payload = this.authService.verifyJwtToken(token);
            const session = await this.sessionRepository.findOne({
                where: {
                    token,
                    isActive: true,
                    expiresAt: (0, typeorm_2.MoreThanOrEqual)(new Date())
                }
            });
            if (!session) {
                throw new common_1.UnauthorizedException('Session is invalid or expired');
            }
            return payload;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
    async cleanupExpiredSessions() {
        const now = new Date();
        await this.sessionRepository.delete({
            expiresAt: (0, typeorm_2.LessThan)(now)
        });
        console.log('Cleaned up expired sessions');
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.UserSession)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        auth_service_1.AuthService])
], SessionService);
//# sourceMappingURL=session.service.js.map