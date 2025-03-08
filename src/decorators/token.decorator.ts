import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { extractTokenFromHeader } from '../utils/token.util';

/**
 * Parameter decorator that extracts the JWT token from the request
 * Throws UnauthorizedException if token is missing or invalid
 */
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    
    // First check if token is already stored in request
    if (request.token) {
      return request.token;
    }
    
    // Otherwise extract from authorization header
    const authHeader = request.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }
    
    return token;
  },
);

/**
 * Parameter decorator that safely extracts the JWT token from the request
 * Returns null if token is missing or invalid
 */
export const OptionalToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    
    // First check if token is already stored in request
    if (request.token) {
      return request.token;
    }
    
    // Otherwise extract from authorization header
    const authHeader = request.headers.authorization;
    return extractTokenFromHeader(authHeader);
  },
); 