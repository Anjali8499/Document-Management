import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from './extract-token.util';
import { SessionService } from '../session.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Extracts and decodes token information from request headers
 * @param request Express request object
 * @param jwtService JWT service for token verification
 * @returns The decoded token payload
 * @throws UnauthorizedException if token is missing, invalid, or expired
 */
export function getTokenInfo(request: Request, jwtService: JwtService): JwtPayload {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(request);
    
    // Verify and decode the token
    const payload = jwtService.verify<JwtPayload>(token);
    
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
}


/**
 * Extracts and verifies token information from request headers, including session validation
 * @param request Express request object
 * @param sessionService Session service for validating the token session
 * @returns The decoded token payload
 * @throws UnauthorizedException if token is missing, invalid, expired, or session is invalid
 */
export async function getVerifiedTokenInfo(request: Request, sessionService: SessionService): Promise<JwtPayload> {
  try {
    // Extract token from header
    const token = extractTokenFromHeader(request);
    
    // Verify the token and session
    return await sessionService.verifySession(token);
  } catch {
    throw new UnauthorizedException('Invalid or expired token');
  }
}
