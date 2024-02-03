import { Injectable } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { createUserDto } from './dtos/createUserDto';
import { updateUserDto } from './dtos/updateUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/article.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser(username: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.likedArticle', 'article')
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

  async updateUser(entity: User): Promise<UpdateResult> {
    const { likedArticle, ...user } = entity;
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        ...user,
        updatedAt: Date.now(),
      })
      .where('username = :username', { username: entity?.username })
      .execute();
  }

  async likeUser(entity: User): Promise<User> {
    return await this.userRepository.save({ ...entity });
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
