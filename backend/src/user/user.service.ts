import { Injectable, Inject } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { createUserDto } from './dtos/createUserDto';
import { updateUserDto } from './dtos/updateUserDto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async getUser(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async saveUser(dto: createUserDto): Promise<User> {
    return await this.userRepository.save({ ...dto });
  }

  async updateUser(username: string, dto: updateUserDto): Promise<User> {
    const property = await this.userRepository.findOne({
      where: { username },
    });

    return this.userRepository.save({
      ...property,
      ...dto,
    });
  }

  async deleteUser(dto: createUserDto): Promise<DeleteResult> {
    const deleteResult = await this.userRepository.delete({
      username: dto.username,
    });
    return deleteResult;
  }
}
