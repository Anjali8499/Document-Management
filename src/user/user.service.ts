import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(username: string, email: string, password: string, mobile: string, role: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.email = email;
    user.mobile = mobile;
    user.role = role;
    user.password = password;

    return this.userRepository.save(user);
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'mobile', 'role']
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'mobile', 'role']
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { mobile } });
  }
  
  async findByEmailOrMobile(email: string, mobile: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { email },
        { mobile }
      ]
    });
  }

  async checkUserExists(email: string, mobile: string): Promise<void> {
    const existingUserByEmail = await this.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const existingUserByMobile = await this.findByMobile(mobile);
    if (existingUserByMobile) {
      throw new ConflictException(`User with mobile number ${mobile} already exists`);
    }
  }

  async checkUserExistsForUpdate(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    // Check if mobile is being updated and if it already exists
    if (updateUserDto.mobile) {
      const existingUserByMobile = await this.findByMobile(updateUserDto.mobile);
      if (existingUserByMobile && existingUserByMobile.id !== id) {
        throw new ConflictException(`User with mobile number ${updateUserDto.mobile} already exists`);
      }
    }
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User | null> {
    try {
      await this.userRepository.update(id, updateUserDto);
      return this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
