import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';
interface JwtPayload {
    id: number;
    email: string;
    role: string;
}
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<UserResponseDto>;
    logout(token: string): Promise<void>;
    findAll(user: JwtPayload): Promise<UserResponseDto[]>;
    updateUser(id: string, updateUserDto: UpdateUserDto, user: JwtPayload): Promise<UserResponseDto>;
    getTokenInfo(token: string): Promise<{
        tokenInfo: JwtPayload;
    }>;
}
export {};
