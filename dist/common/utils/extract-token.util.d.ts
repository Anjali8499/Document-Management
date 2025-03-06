import { Request } from 'express';
export declare function extractTokenFromHeader(request: Request): string;
export declare function safeExtractTokenFromHeader(request: Request): string | null;
