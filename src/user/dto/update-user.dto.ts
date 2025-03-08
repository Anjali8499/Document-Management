import {  IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
