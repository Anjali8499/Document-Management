import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../auth/session.service';
import { extractTokenFromHeader } from '../utils/extract-token.util';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private sessionService: SessionService
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract token from header
      const token = extractTokenFromHeader(req);
      
      // Verify the token and session
      const payload = await this.sessionService.verifySession(token);
      
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