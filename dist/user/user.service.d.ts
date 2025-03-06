import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
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
}
