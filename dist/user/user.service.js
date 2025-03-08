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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const jwt_1 = require("@nestjs/jwt");
const token_util_1 = require("../utils/token.util");
let UserService = class UserService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async createUser(username, email, password, mobile, role) {
        const user = new user_entity_1.User();
        user.username = username;
        user.email = email;
        user.mobile = mobile;
        user.role = role;
        user.password = password;
        return this.userRepository.save(user);
    }
    async findAll() {
        return this.userRepository.find({
            select: ['id', 'username', 'email', 'mobile', 'role']
        });
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'username', 'email', 'mobile', 'role']
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async findByMobile(mobile) {
        return this.userRepository.findOne({ where: { mobile } });
    }
    async findByEmailOrMobile(email, mobile) {
        return this.userRepository.findOne({
            where: [
                { email },
                { mobile }
            ]
        });
    }
    async checkUserExists(email, mobile) {
        const existingUserByEmail = await this.findByEmail(email);
        if (existingUserByEmail) {
            throw new common_1.ConflictException(`User with email ${email} already exists`);
        }
        const existingUserByMobile = await this.findByMobile(mobile);
        if (existingUserByMobile) {
            throw new common_1.ConflictException(`User with mobile number ${mobile} already exists`);
        }
    }
    async checkUserExistsForUpdate(id, updateUserDto) {
        if (updateUserDto.mobile) {
            const existingUserByMobile = await this.findByMobile(updateUserDto.mobile);
            if (existingUserByMobile && existingUserByMobile.id !== id) {
                throw new common_1.ConflictException(`User with mobile number ${updateUserDto.mobile} already exists`);
            }
        }
    }
    async update(id, updateUserDto) {
        try {
            await this.userRepository.update(id, updateUserDto);
            return this.userRepository.findOne({ where: { id } });
        }
        catch (error) {
            throw new Error(`Error updating user: ${error}`);
        }
    }
    async remove(id) {
        await this.userRepository.delete(id);
    }
    signToken(payload) {
        return (0, token_util_1.createToken)(payload, this.jwtService);
    }
    async storeSession(userId, userData, ttl = 86400) {
        await (0, token_util_1.storeUserSession)(userId, userData, ttl);
    }
    async removeSession(userId) {
        await (0, token_util_1.removeUserSession)(userId);
    }
    async blacklistToken(token) {
        const ttl = (0, token_util_1.getTokenExpirationTime)(token);
        await (0, token_util_1.blacklistToken)(token, ttl);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map