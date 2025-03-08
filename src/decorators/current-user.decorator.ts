import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../utils/token.util';

/**
 * Parameter decorator that extracts the current user from the request
 * Throws UnauthorizedException if user is not authenticated
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    
    if (!request.user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return request.user;
  },
); 