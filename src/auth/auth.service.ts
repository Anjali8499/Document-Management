import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { SessionService } from './session.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private sessionService: SessionService
  ) {}

  /**
   * Generate a JWT token for a user
   * @param user The user to generate a token for
   * @returns The JWT token
   */
  generateJwtToken(user: User): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Verify a JWT token
   * @param token The JWT token to verify
   * @returns The decoded token payload
   */
  verifyJwtToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  async revokeToken(token: string): Promise<void> {
    await this.sessionService.invalidateSession(token);
  }
} 