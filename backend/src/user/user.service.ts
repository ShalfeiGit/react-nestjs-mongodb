import { Injectable } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { createUserDto } from './dtos/createUserDto';
import { updateUserDto } from './dtos/updateUserDto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser(username: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }

  async saveUser(dto: createUserDto): Promise<InsertResult> {
    return await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...dto, createdAt: Date.now() }])
      .execute();
  }

  async updateUser(
    username: string,
    dto: updateUserDto,
  ): Promise<UpdateResult> {
    return this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...dto, updatedAt: Date.now() })
      .where('username = :username', { username })
      .execute();
  }

  async deleteUser(username: string): Promise<DeleteResult> {
    return await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('username = :username', { username })
      .execute();
  }
}
