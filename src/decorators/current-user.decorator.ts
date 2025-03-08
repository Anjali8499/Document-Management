import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Parameter decorator that extracts the current user from the request
 * Throws UnauthorizedException if user is not authenticated
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const user = ctx.switchToHttp().getRequest< JwtPayload >();
    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }
    return user;
  },
);