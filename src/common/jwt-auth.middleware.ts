import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './token-blacklist.service';
import { extractTokenFromHeader } from './utils/extract-token.util';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    try {
      // Extract token from header
      const token = extractTokenFromHeader(req);
      
      // Check if token is blacklisted
      if (this.tokenBlacklistService.isBlacklisted(token)) {
        return next(new UnauthorizedException('Token has been revoked'));
      }
      
      // Verify the token
      const payload = this.jwtService.verify<JwtPayload>(token);
      
      // Attach user info and token to request object
      req['user'] = payload;
      req['token'] = token; // Store the token for logout functionality
      
      next();
    } catch (error) {
      // If token extraction or verification fails, pass an unauthorized exception to the next middleware
      if (error instanceof UnauthorizedException) {
        next(error);
      } else {
        next(new UnauthorizedException('Invalid or expired token'));
      }
    }
  }
} 