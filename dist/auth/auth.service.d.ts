import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { TokenBlacklistService } from '../common/token-blacklist.service';
export declare class AuthService {
    private jwtService;
    private tokenBlacklistService;
    constructor(jwtService: JwtService, tokenBlacklistService: TokenBlacklistService);
    generateToken(user: User): string;
    verifyToken(token: string): any;
    revokeToken(token: string): Promise<void>;
}
