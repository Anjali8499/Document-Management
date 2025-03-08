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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("./dto/user.dto");
const swagger_1 = require("@nestjs/swagger");
const password_utils_1 = require("../utils/password.utils");
const user_service_1 = require("./user.service");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const token_decorator_1 = require("../decorators/token.decorator");
const redis_util_1 = require("../utils/redis.util");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(createUserDto) {
        try {
            const { username, email, mobile, password, role } = createUserDto;
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
            const hashedPassword = await (0, password_utils_1.hashPassword)(password);
            const user = await this.userService.createUser(username, email, hashedPassword, mobile, role);
            if (!user) {
                throw new common_1.InternalServerErrorException('Error during registration');
            }
            const token = this.userService.signToken({
                id: user.id,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            });
            await this.userService.storeSession(user.id, user);
            await (0, redis_util_1.setRedisValue)(user.id.toString(), token, 3600);
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                accessToken: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error('Registration error:', error);
            throw new common_1.InternalServerErrorException('Error during registration');
        }
    }
    async login(loginDto) {
        try {
            const user = await this.userService.findByEmail(loginDto.email);
            if (!user) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await (0, password_utils_1.comparePasswords)(loginDto.password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const token = this.userService.signToken({
                id: user.id,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            });
            await this.userService.storeSession(user.id, user);
            await (0, redis_util_1.setRedisValue)(user.id.toString(), token, 3600);
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                accessToken: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Login error:', error);
            throw new common_1.InternalServerErrorException('Error during login');
        }
    }
    async logout(user, token) {
        try {
            await this.userService.blacklistToken(token);
            await this.userService.removeSession(user.id);
            console.log(`User ${user.email} (ID: ${user.id}) logged out successfully`);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Logout error:', error);
            throw new common_1.InternalServerErrorException('Error during logout');
        }
    }
    async findAll(user) {
        try {
            if (user.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('Only administrators can access all users');
            }
            const users = await this.userService.findAll();
            return users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }));
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.error('Error fetching users:', error);
            throw new common_1.InternalServerErrorException('Error fetching users');
        }
    }
    async findOne(id, user) {
        try {
            if (user.id !== parseInt(id) && user.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('You can only access your own profile');
            }
            const foundUser = await this.userService.findOne(parseInt(id));
            return {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
                mobile: foundUser.mobile,
                role: foundUser.role
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.error(`Error fetching user ${id}:`, error);
            throw new common_1.InternalServerErrorException('Error fetching user');
        }
    }
    async updateUser(id, updateUserDto, user) {
        try {
            if (user.id !== parseInt(id) && user.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('You can only update your own profile');
            }
            const updatedUser = await this.userService.update(parseInt(id), updateUserDto);
            if (!updatedUser) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            return {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                role: updatedUser.role
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.error(`Error updating user ${id}:`, error);
            throw new common_1.InternalServerErrorException('Error updating user');
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully', type: user_dto_1.UserResponseDto }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged in successfully', type: user_dto_1.UserResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, token_decorator_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all users', type: [user_dto_1.UserResponseDto] }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Requires admin role' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return user by ID', type: user_dto_1.UserResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Can only access own profile unless admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully', type: user_dto_1.UserResponseDto }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Can only update own profile unless admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map