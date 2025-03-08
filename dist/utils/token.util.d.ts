import { JwtService } from '@nestjs/jwt';
export interface JwtPayload {
    id: number;
    email: string;
    role: string;
    mobile?: string;
}
export declare function createToken(payload: JwtPayload, jwtService: JwtService, expiresIn?: string): string;
export declare function verifyToken(token: string, jwtService: JwtService): JwtPayload;
export declare function storeUserSession(userId: number | string, userData: any, ttl?: number): Promise<void>;
export declare function getUserSession(userId: number | string): Promise<any | null>;
export declare function removeUserSession(userId: number | string): Promise<void>;
export declare function blacklistToken(token: string, ttl: number): Promise<void>;
export declare function isTokenBlacklisted(token: string): Promise<boolean>;
export declare function extractTokenFromHeader(authHeader: string | undefined): string | null;
export declare function getTokenExpirationTime(token: string): number;
