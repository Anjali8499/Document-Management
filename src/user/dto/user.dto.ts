import { IsString, IsEmail, MinLength, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER',
}

export class CreateUserDto {
    @ApiProperty({ description: 'Username of the user' })
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20)
    username: string;

    @ApiProperty({ description: 'Email of the user' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password of the user' })
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'Mobile number of the user' })
    @MinLength(10)
    @MaxLength(10)
    mobile: string;

    @ApiProperty({ 
        description: 'Role of the user', 
        enum: UserRole, 
        example: 'ADMIN' 
      })
      @IsEnum(UserRole)
      role: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'Username of the user', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  username?: string;

  @ApiProperty({ description: 'Mobile number of the user', required: false })
  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  mobile?: string;

}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;
  
  @ApiProperty({ description: 'Username' })
  username: string;
  
  @ApiProperty({ description: 'Email address' })
  email: string;
  
  @ApiProperty({ description: 'Mobile number' })
  mobile: string;
  
  @ApiProperty({ description: 'User role' })
  role: string;
  
  @ApiProperty({ description: 'JWT access token', required: false })
  accessToken?: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}

