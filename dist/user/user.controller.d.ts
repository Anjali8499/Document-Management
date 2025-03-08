import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { SessionService } from '../auth/session.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    private readonly sessionService;
    constructor(userService: UserService, authService: AuthService, sessionService: SessionService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<UserResponseDto>;
    logout(user: JwtPayload): Promise<{
        message: string;
    }>;
    logoutSession(sessionId: string, user: JwtPayload): Promise<{
        message: string;
    }>;
    findAll(user: JwtPayload): Promise<UserResponseDto[]>;
    findOne(id: string, user: JwtPayload): Promise<UserResponseDto>;
    updateUser(id: string, updateUserDto: UpdateUserDto, user: JwtPayload): Promise<UserResponseDto>;
    getActiveSessions(user: JwtPayload): Promise<{
        sessions: any[];
    }>;
}
