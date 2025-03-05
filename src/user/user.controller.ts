import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
// import { User } from './user.entity';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'User successfully created', type: UserResponseDto })  
  createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    const { username, email, password, mobile, role } = createUserDto;
    return this.userService.createUser(username, email, password, mobile, role);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all users', type: [UserResponseDto] }) 
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get user by ID', type: UserResponseDto }) 
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(Number(id));
  }

//   @Patch(':id')
//   @ApiResponse({ status: 200, description: 'User successfully updated', type: UserResponseDto })
//   update(
//     @Param('id') id: string,
//     @Body() updateUserDto: UpdateUserDto,
//   ): Promise<UserResponseDto> {
//     return this.userService.update(Number(id), updateUserDto);
//   }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(Number(id));
  }
}
