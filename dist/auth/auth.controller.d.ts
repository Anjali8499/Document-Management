import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
export declare class AuthController {
    private jwtService;
    private sessionService;
    constructor(jwtService: JwtService, sessionService: SessionService);
    getBasicTokenInfo(request: Request): Promise<{
        tokenInfo: JwtPayload;
    }>;
    getVerifiedTokenInfo(request: Request): Promise<{
        tokenInfo: JwtPayload;
    }>;
}
