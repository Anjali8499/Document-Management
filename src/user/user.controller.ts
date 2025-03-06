import { Controller, Get, Post, Param, Body, Patch, InternalServerErrorException, ConflictException, NotFoundException, UnauthorizedException, ForbiddenException, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiConflictResponse, ApiNotFoundResponse, ApiUnauthorizedResponse, ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { hashPassword, comparePasswords } from '../utils/password.utils';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../common/current-user.decorator';
import { Token } from '../common/token.decorator';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

@ApiTags('auth')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'User registered successfully', type: UserResponseDto })  
  @ApiConflictResponse({ description: 'User with the same email or mobile already exists' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const { username, email, mobile, role } = createUserDto;
      
      // Check if user with same email or mobile already exists
      const existingUser = await this.userService.findByEmailOrMobile(email, mobile);
      if (existingUser) {
        throw new ConflictException('User with this email or mobile already exists');
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(createUserDto.password);
      
      // Create the user
      const user = await this.userService.createUser(username, email, hashedPassword, mobile, role);
      
      // Return user data without sensitive information
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<UserResponseDto> {
    const { email, password } = loginDto;
    try {
      // Find user by email
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify password using the utility function
      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token using AuthService
      const token = this.authService.generateToken(user);

      // Return user data and token
      return {
        id: user.id,
        username: user.username,
        email: user.email, 
        mobile: user.mobile,
        role: user.role,
        accessToken: token
      };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
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
  async logout(@CurrentUser()  @Token() token: string): Promise<void> {
    try {
      // Revoke the token by adding it to the blacklist
      await this.authService.revokeToken(token);
      return;
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Logout error:', error);
      throw new InternalServerErrorException('Error during logout');
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
      return users;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  @Patch('users/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden - Can only update own profile unless admin' })
  @ApiConflictResponse({ description: 'User with the same email or mobile already exists' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: JwtPayload
  ): Promise<UserResponseDto> {
    try {
      const userId = Number(id);
      
      // Check if user is updating their own profile or is an admin
      if (user.id !== userId && user.role !== 'ADMIN') {
        throw new ForbiddenException('You can only update your own profile');
      }
      
      // Check if updating to an email or mobile that already exists
      if (updateUserDto.email || updateUserDto.mobile) {
        await this.userService.checkUserExistsForUpdate(userId, updateUserDto);
      }
      
      // If password is being updated, hash it
      if (updateUserDto.password) {
        const hashedPassword = await hashPassword(updateUserDto.password);
        updateUserDto.password = hashedPassword;
      }
      
      const updatedUser = await this.userService.update(userId, updateUserDto);
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
      if (error instanceof NotFoundException || 
          error instanceof ConflictException || 
          error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  @Get('token-info')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Token information retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getTokenInfo(@Token() token: string): Promise<{ tokenInfo: JwtPayload }> {
    try {
      // Decode the token to get its information
      const decodedToken = await this.authService.verifyToken(token) as JwtPayload;
      // Create a clean payload without sensitive information
      const tokenInfo: JwtPayload = {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role
      };
      
      return { tokenInfo };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Token info error:', error);
      throw new InternalServerErrorException('Error retrieving token information');
    }
  }
}

