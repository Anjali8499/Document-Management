import { IsString, IsEmail, MinLength, MaxLength, IsEnum } from 'class-validator';
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
