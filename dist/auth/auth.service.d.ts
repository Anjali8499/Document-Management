import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { SessionService } from './session.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthService {
    private jwtService;
    private sessionService;
    constructor(jwtService: JwtService, sessionService: SessionService);
    generateJwtToken(user: User): string;
    verifyJwtToken(token: string): JwtPayload;
    revokeToken(token: string): Promise<void>;
}
