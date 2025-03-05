import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } }).then(user => {
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<void> {
    return this.userRepository.update(id, updateUserDto).then(() => {});
  }

  async remove(id: number): Promise<void> {
    return this.userRepository.delete(id).then(() => {});
  }
}
