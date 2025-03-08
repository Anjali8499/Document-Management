import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from './auth.entity';
import { User } from '../user/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from './auth.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
    private jwtService: JwtService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService
  ) {
    // Clean up expired sessions periodically (every hour)
    setInterval(() => {
      void this.cleanupExpiredSessions();
    }, 60 * 60 * 1000);
  }

  /**
   * Create a new session for a user
   * @param user The user to create a session for
   * @returns The JWT token for the session
   */
  async createSession(user: User): Promise<string> {
    // Generate JWT token using the auth service
    const token = this.authService.generateJwtToken(user);
    
    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    // Create session record
    const session = this.sessionRepository.create({
      userId: user.id,
      token,
      expiresAt,
      isActive: true,
    });
    
    await this.sessionRepository.save(session);
    return token;
  }

  /**
   * Find all active sessions for a user
   * @param userId The user ID to find sessions for
   * @returns Array of active user sessions
   */
  async findActiveSessionsByUserId(userId: number): Promise<UserSession[]> {
    return this.sessionRepository.find({
      where: {
        userId,
        isActive: true,
        expiresAt: MoreThanOrEqual(new Date())
      }
    });
  }

  /**
   * Invalidate a session by its token
   * @param token The JWT token to invalidate
   */
  async invalidateSession(token: string): Promise<void> {
    const session = await this.sessionRepository.findOne({ where: { token } });
    
    if (session) {
      session.isActive = false;
      await this.sessionRepository.save(session);
    }
  }

  /**
   * Invalidate all sessions for a user
   * @param userId The user ID to invalidate sessions for
   * @returns The number of sessions invalidated
   */
  async invalidateAllSessionsForUser(userId: number): Promise<number> {
    const result = await this.sessionRepository.update(
      { 
        userId, 
        isActive: true 
      },
      { 
        isActive: false 
      }
    );
    
    return result.affected || 0;
  }

  /**
   * Verify if a token is valid and active
   * @param token The JWT token to verify
   * @returns The decoded token payload if valid
   * @throws UnauthorizedException if token is invalid or inactive
   */
  async verifySession(token: string): Promise<JwtPayload> {
    try {
      // First verify the JWT signature using the auth service
      const payload = this.authService.verifyJwtToken(token);
      
      // Then check if the token exists in the database and is active
      const session = await this.sessionRepository.findOne({ 
        where: { 
          token,
          isActive: true,
          // We want sessions that have NOT expired yet (expiresAt > now)
          expiresAt: MoreThanOrEqual(new Date())
        }
      });
      
      if (!session) {
        throw new UnauthorizedException('Session is invalid or expired');
      }
      
      return payload;
    } catch {
      // Catch any errors and throw a standardized unauthorized exception
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Clean up expired sessions
   */
  private async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    
    // Find and remove expired sessions
    await this.sessionRepository.delete({
      expiresAt: LessThan(now)
    });
    
    console.log('Cleaned up expired sessions');
  }

  /**
   * Invalidate a session by its ID
   * @param sessionId The session ID to invalidate
   * @param userId The user ID (for security verification)
   * @returns True if the session was found and invalidated, false otherwise
   */
  async invalidateSessionById(sessionId: number, userId: number): Promise<boolean> {
    // First find the session to verify it belongs to the user
    const session = await this.sessionRepository.findOne({ 
      where: { 
        id: sessionId,
        userId
      }
    });
    
    if (!session) {
      return false;
    }
    
    // Invalidate the session
    session.isActive = false;
    await this.sessionRepository.save(session);
    return true;
  }
} 