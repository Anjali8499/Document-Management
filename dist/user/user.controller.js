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
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_response_dto_1 = require("./dto/user-response.dto");
const login_dto_1 = require("./dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const password_utils_1 = require("../utils/password.utils");
const auth_service_1 = require("../auth/auth.service");
const current_user_decorator_1 = require("../common/current-user.decorator");
const token_decorator_1 = require("../common/token.decorator");
let UserController = class UserController {
    userService;
    authService;
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async createUser(createUserDto) {
        try {
            const { username, email, mobile, role } = createUserDto;
            const existingUser = await this.userService.findByEmailOrMobile(email, mobile);
            if (existingUser) {
                throw new common_1.ConflictException('User with this email or mobile already exists');
            }
            const hashedPassword = await (0, password_utils_1.hashPassword)(createUserDto.password);
            const user = await this.userService.createUser(username, email, hashedPassword, mobile, role);
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error creating user');
        }
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const isPasswordValid = await (0, password_utils_1.comparePasswords)(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const token = this.authService.generateToken(user);
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                accessToken: token
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error('Login error:', error);
            throw new common_1.InternalServerErrorException('Error during login');
        }
    }
    async logout(token) {
        try {
            await this.authService.revokeToken(token);
            return;
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
            return users;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.error('Error fetching users:', error);
            throw new common_1.InternalServerErrorException('Error fetching users');
        }
    }
    async updateUser(id, updateUserDto, user) {
        try {
            const userId = Number(id);
            if (user.id !== userId && user.role !== 'ADMIN') {
                throw new common_1.ForbiddenException('You can only update your own profile');
            }
            if (updateUserDto.email || updateUserDto.mobile) {
                await this.userService.checkUserExistsForUpdate(userId, updateUserDto);
            }
            if (updateUserDto.password) {
                const hashedPassword = await (0, password_utils_1.hashPassword)(updateUserDto.password);
                updateUserDto.password = hashedPassword;
            }
            const updatedUser = await this.userService.update(userId, updateUserDto);
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
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.error('Error updating user:', error);
            throw new common_1.InternalServerErrorException('Error updating user');
        }
    }
    async getTokenInfo(token) {
        try {
            const decodedToken = await this.authService.verifyToken(token);
            const tokenInfo = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role
            };
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
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully', type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiConflictResponse)({ description: 'User with the same email or mobile already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged in successfully', type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Delete)('logout'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User logged out successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(0, (0, token_decorator_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all users', type: [user_response_dto_1.UserResponseDto] }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Requires admin role' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User updated successfully', type: user_response_dto_1.UserResponseDto }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden - Can only update own profile unless admin' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'User with the same email or mobile already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('token-info'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token information retrieved successfully' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, token_decorator_1.Token)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTokenInfo", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map