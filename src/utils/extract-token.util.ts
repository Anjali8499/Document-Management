import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

/**
 * Extracts the JWT token from the Authorization header
 * @param request Express request object
 * @returns The JWT token string
 * @throws UnauthorizedException if token is missing or invalid
 */
export function extractTokenFromHeader(request: Request): string {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Missing or invalid authorization token');
  }
  
  return authHeader.split(' ')[1];
}
