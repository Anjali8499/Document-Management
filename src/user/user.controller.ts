import { Controller, Get, Post, Param, Body, Patch, InternalServerErrorException, ConflictException, NotFoundException, UnauthorizedException, ForbiddenException, Inject, forwardRef, Delete } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto, LoginDto } from './dto/user.dto';
import { ApiTags, ApiResponse, ApiConflictResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { hashPassword, comparePasswords } from '../utils/password.utils';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../decorators/current-user.decorator'; 
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionService } from '../auth/session.service';

@ApiTags('users')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => SessionService))
    private readonly sessionService: SessionService
  ) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })
  @ApiConflictResponse({ description: 'Email already exists' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const { username, email, mobile, password, role } = createUserDto;
      
      // Check if user with this email already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);
      
      // Create the user with hashed password
      const user = await this.userService.createUser(username, email, hashedPassword, mobile, role);

      // Create a session directly using the session service
      const token = await this.sessionService.createSession(user);

      // Return user data with token
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Error during registration');
    }
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<UserResponseDto> {
    try {
      // Find user by email
      const user = await this.userService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await comparePasswords(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Create a session directly using the session service
      const token = await this.sessionService.createSession(user);

      // Return user data with token
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        accessToken: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Error during login');
    }
  }

  @Delete('logout')
  @ApiBearerAuth()    
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@CurrentUser() user: JwtPayload): Promise<{ message: string }> {
    try {
      // Get all active sessions for this user
      const activeSessions = await this.sessionService.findActiveSessionsByUserId(user.id);
      
      if (activeSessions.length === 0) {
        return { message: 'No active sessions to logout from' };
      }
      
      // Revoke the current token by invalidating the session
      await this.sessionService.invalidateSession(user.token);
      
      // Log the successful logout
      console.log(`User ${user.email} (ID: ${user.id}) logged out successfully`);
      
      return { message: 'Logged out successfully' };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Logout error:', error);
      throw new InternalServerErrorException('Error during logout');
    }
  }

  @Post('logout/session/:id')
  @ApiBearerAuth()    
  @ApiResponse({ status: 200, description: 'Session invalidated successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async logoutSession(
    @Param('id') sessionId: string,
    @CurrentUser() user: JwtPayload
  ): Promise<{ message: string }> {
    try {
      const id = parseInt(sessionId, 10);
      if (isNaN(id)) {
        throw new NotFoundException('Invalid session ID');
      }
      
      // Invalidate the specific session
      const success = await this.sessionService.invalidateSessionById(id, user.id);
      
      if (!success) {
        throw new NotFoundException('Session not found or does not belong to you');
      }
      
      // Log the successful session invalidation
      console.log(`User ${user.email} (ID: ${user.id}) invalidated session ${id}`);
      
      return { message: 'Session invalidated successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Session invalidation error:', error);
      throw new InternalServerErrorException('Error during session invalidation');
    }
  }
  

  @Get('users')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all users', type: [UserResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Requires admin role' })
  async findAll(@CurrentUser() user: JwtPayload): Promise<UserResponseDto[]> {
    try {
      // Check if user has admin role
      if (user.role !== 'ADMIN') {
        throw new ForbiddenException('Only administrators can access all users');
      }
      
      const users = await this.userService.findAll();
      return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }));
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  @Get('users/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return user by ID', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Can only access own profile unless admin' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    try {
      // Check if user is trying to access their own profile or is an admin
      if (user.id !== parseInt(id) && user.role !== 'ADMIN') {
        throw new ForbiddenException('You can only access your own profile');
      }
      
      const foundUser = await this.userService.findOne(parseInt(id));
      
      return {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        mobile: foundUser.mobile,
        role: foundUser.role
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error(`Error fetching user ${id}:`, error);
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  @Patch('users/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Forbidden - Can only update own profile unless admin' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload
  ): Promise<UserResponseDto> {
    try {
      // Check if user is trying to update their own profile or is an admin
      if (user.id !== parseInt(id) && user.role !== 'ADMIN') {
        throw new ForbiddenException('You can only update your own profile');
      }
      
      const updatedUser = await this.userService.update(parseInt(id), updateUserDto);
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      
      return {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error(`Error updating user ${id}:`, error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @Get('sessions')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Return all active sessions for the current user' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getActiveSessions(@CurrentUser() user: JwtPayload): Promise<{ sessions: any[] }> {
    try {
      // Get all active sessions for this user
      const sessions = await this.sessionService.findActiveSessionsByUserId(user.id);
      
      // Return only necessary session information (exclude sensitive data)
      const sanitizedSessions = sessions.map(session => ({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        // Include a truncated version of the token for identification
        tokenPreview: session.token.substring(0, 10) + '...'
      }));
      
      return { sessions: sanitizedSessions };
    } catch (error: unknown) {
      console.error('Error fetching active sessions:', error);
      throw new InternalServerErrorException('Error fetching active sessions');
    }
  }
}