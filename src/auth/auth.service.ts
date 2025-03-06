import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { TokenBlacklistService } from '../common/token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService
  ) {}

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }

  async revokeToken(token: string): Promise<void> {
    await this.tokenBlacklistService.blacklistToken(token);
  }
} 