import { ApiProperty } from '@nestjs/swagger';

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
