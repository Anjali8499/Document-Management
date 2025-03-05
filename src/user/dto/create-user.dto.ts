import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20)
    username: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @MinLength(10)
    @MaxLength(10)
    mobile: string;

    @IsString()
    enum: ['ADMIN', 'EDITOR', 'VIEWER'];
    role: string;
}
