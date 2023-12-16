import { Injectable, Inject } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
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
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }

  async saveUser(dto: createUserDto): Promise<InsertResult> {
    const insertResult = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ ...dto })
      .execute();
    return insertResult;
  }

  async updateUser(
    username: string,
    dto: updateUserDto,
  ): Promise<UpdateResult> {
    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ ...dto })
      .where('user.username = :username', { username })
      .execute();
    return updateResult;
  }

  async deleteUser(dto: createUserDto): Promise<DeleteResult> {
    const deleteResult = await this.userRepository.delete({
      username: dto.username,
    });
    return deleteResult;
  }
}
