import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type BlacklistedToken = {
  token: string;
  expiresAt: Date;
}

@Injectable()
export class TokenBlacklistService {
  private blacklistedTokens: Map<string, Date> = new Map();

  constructor(private jwtService: JwtService) {
    // Clean up expired tokens periodically (every hour)
    setInterval(() => this.removeExpiredTokens(), 60 * 60 * 1000);
  }

  /**
   * Add a token to the blacklist
   * @param token The JWT token to blacklist
   */
  async blacklistToken(token: string): Promise<void> {
    try {
      // Decode the token to get its expiration time
      const decoded = this.jwtService.decode(token);
      
      if (decoded && typeof decoded === 'object' && decoded.exp) {
        // Convert exp (in seconds) to milliseconds and create a Date
        const expiresAt = new Date(decoded.exp * 1000);
        
        // Add to blacklist
        this.blacklistedTokens.set(token, expiresAt);
        console.log(`Token blacklisted until ${expiresAt}`);
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  /**
   * Check if a token is blacklisted
   * @param token The JWT token to check
   * @returns true if the token is blacklisted, false otherwise
   */
  isBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  /**
   * Remove expired tokens from the blacklist
   */
  private removeExpiredTokens(): void {
    const now = new Date();
    
    for (const [token, expiresAt] of this.blacklistedTokens.entries()) {
      if (expiresAt <= now) {
        this.blacklistedTokens.delete(token);
      }
    }
    
    console.log(`Cleaned up blacklist. Current size: ${this.blacklistedTokens.size}`);
  }
} 