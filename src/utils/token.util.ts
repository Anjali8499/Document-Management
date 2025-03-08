import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { setRedisValue, getRedisValue, deleteRedisValue } from './redis.util';

// Define the JWT payload interface
export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  mobile?: string;
}

/**
 * Create a JWT token for a user
 * @param payload The user data to include in the token
 * @param jwtService The JWT service instance
 * @param expiresIn Token expiration time (in seconds)
 * @returns The JWT token
 */
export function createToken(
  payload: JwtPayload, 
  jwtService: JwtService, 
  expiresIn: string = '24h'
): string {
  return jwtService.sign(payload, { expiresIn });
}

/**
 * Verify a JWT token
 * @param token The JWT token to verify
 * @param jwtService The JWT service instance
 * @returns The decoded token payload
 * @throws UnauthorizedException if token is invalid
 */
export function verifyToken(token: string, jwtService: JwtService): JwtPayload {
  try {
    return jwtService.verify<JwtPayload>(token);
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
}

/**
 * Store user session in Redis
 * @param userId User ID
 * @param userData User data to store
 * @param ttl Time to live in seconds (default: 24 hours)
 */
export async function storeUserSession(
  userId: number | string, 
  userData: any, 
  ttl: number = 86400
): Promise<void> {
  const key = `user_session:${userId}`;
  await setRedisValue(key, JSON.stringify(userData), ttl);
}

/**
 * Get user session from Redis
 * @param userId User ID
 * @returns User data or null if not found
 */
export async function getUserSession(userId: number | string): Promise<any | null> {
  const key = `user_session:${userId}`;
  const data = await getRedisValue(key);
  
  if (!data) {
    return null;
  }
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing user session data:', error);
    return null;
  }
}

/**
 * Remove user session from Redis
 * @param userId User ID
 */
export async function removeUserSession(userId: number | string): Promise<void> {
  const key = `user_session:${userId}`;
  await deleteRedisValue(key);
}

/**
 * Blacklist a token in Redis
 * @param token The token to blacklist
 * @param ttl Time to live in seconds (should match token expiration)
 */
export async function blacklistToken(token: string, ttl: number): Promise<void> {
  const key = `blacklisted_token:${token}`;
  await setRedisValue(key, '1', ttl);
}

/**
 * Check if a token is blacklisted
 * @param token The token to check
 * @returns True if token is blacklisted, false otherwise
 */
export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const key = `blacklisted_token:${token}`;
  const value = await getRedisValue(key);
  return value !== null;
}

/**
 * Extract token from authorization header
 * @param authHeader Authorization header value
 * @returns The token or null if not found
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
}

/**
 * Get token expiration time in seconds
 * @param token JWT token
 * @returns Expiration time in seconds or 0 if token is invalid
 */
export function getTokenExpirationTime(token: string): number {
  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()) as { exp?: number };
    if (decoded && typeof decoded.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      return Math.max(decoded.exp - now, 0);
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  
  return 0;
} 