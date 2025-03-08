import { CreateUserDto, UpdateUserDto, UserResponseDto, LoginDto } from './dto/user.dto';
import { UserService } from './user.service';
import { JwtPayload } from '../utils/token.util';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    login(loginDto: LoginDto): Promise<UserResponseDto>;
    logout(user: JwtPayload, token: string): Promise<{
        message: string;
    }>;
    findAll(user: JwtPayload): Promise<UserResponseDto[]>;
    findOne(id: string, user: JwtPayload): Promise<UserResponseDto>;
    updateUser(id: string, updateUserDto: UpdateUserDto, user: JwtPayload): Promise<UserResponseDto>;
}
