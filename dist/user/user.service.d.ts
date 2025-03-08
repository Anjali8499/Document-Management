import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../utils/token.util';
export declare class UserService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    createUser(username: string, email: string, password: string, mobile: string, role: string): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    findByEmailOrMobile(email: string, mobile: string): Promise<User | null>;
    checkUserExists(email: string, mobile: string): Promise<void>;
    checkUserExistsForUpdate(id: number, updateUserDto: UpdateUserDto): Promise<void>;
    update(id: number, updateUserDto: Partial<User>): Promise<User | null>;
    remove(id: number): Promise<void>;
    signToken(payload: JwtPayload): string;
    storeSession(userId: number, userData: any, ttl?: number): Promise<void>;
    removeSession(userId: number): Promise<void>;
    blacklistToken(token: string): Promise<void>;
}
