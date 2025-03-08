import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from './auth.entity';
import { User } from '../user/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';
export declare class SessionService {
    private sessionRepository;
    private jwtService;
    private authService;
    constructor(sessionRepository: Repository<UserSession>, jwtService: JwtService, authService: AuthService);
    createSession(user: User): Promise<string>;
    findActiveSessionsByUserId(userId: number): Promise<UserSession[]>;
    invalidateSession(token: string): Promise<void>;
    invalidateAllSessionsForUser(userId: number): Promise<number>;
    verifySession(token: string): Promise<JwtPayload>;
    private cleanupExpiredSessions;
    invalidateSessionById(sessionId: number, userId: number): Promise<boolean>;
}
