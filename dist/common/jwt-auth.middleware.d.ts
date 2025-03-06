import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './token-blacklist.service';
export declare class JwtAuthMiddleware implements NestMiddleware {
    private jwtService;
    private tokenBlacklistService;
    constructor(jwtService: JwtService, tokenBlacklistService: TokenBlacklistService);
    use(req: Request, res: Response, next: NextFunction): void;
}
