import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { 
  extractTokenFromHeader, 
  verifyToken, 
  isTokenBlacklisted
} from '../utils/token.util';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService
  ) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Extract token from header
      const authHeader = req.headers.authorization;
      const token = extractTokenFromHeader(authHeader);
      
      if (!token) {
        throw new UnauthorizedException('Missing or invalid authorization token');
      }
      
      // Check if token is blacklisted
      const isBlacklisted = await isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
      
      // Verify the token
      const payload = verifyToken(token, this.jwtService);
      
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