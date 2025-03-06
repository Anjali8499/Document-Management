import { IsEmail, IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: 'Username of the user', required: false })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @ApiProperty({ description: 'Email address of the user', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Password of the user', required: false })
    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @ApiProperty({ description: 'Mobile number of the user', required: false })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(10)
    mobile?: string;

    @ApiProperty({ description: 'Role of the user', required: false, enum: ['ADMIN', 'EDITOR', 'VIEWER'] })
    @IsString()
    @IsOptional()
    role?: string;
}
