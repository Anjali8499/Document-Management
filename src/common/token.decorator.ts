import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { extractTokenFromHeader, safeExtractTokenFromHeader } from './utils/extract-token.util';

/**
 * Parameter decorator that extracts the JWT token from the request
 * Throws UnauthorizedException if token is missing or invalid
 */
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return extractTokenFromHeader(request);
  },
);

/**
 * Parameter decorator that safely extracts the JWT token from the request
 * Returns null if token is missing or invalid
 */
export const OptionalToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    return safeExtractTokenFromHeader(request);
  },
); 