import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractTokenFromHeader } from '../utils/extract-token.util';

/**
 * Parameter decorator that extracts the JWT token from the request
 * Throws UnauthorizedException if token is missing or invalid
 */
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return extractTokenFromHeader(request);
  },
);
