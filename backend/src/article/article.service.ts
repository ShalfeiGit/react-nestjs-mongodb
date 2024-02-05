import { Injectable } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Article, TagArticle } from './article.entity';
import { createArticleDto } from './dtos/createArticleDto';
import { updateArticleDto } from './dtos/updateArticleDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getArticleById(id: number): Promise<Article> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .leftJoinAndSelect('article.user', 'user')
      .select(['article'])
      .addSelect(['user.username', 'user.id', 'user.avatarUrl'])
      .getOne();
  }

  async getArticlesByTag(
    tag: TagArticle,
    options: IPaginationOptions,
  ): Promise<Pagination<Article>> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');
    queryBuilder
      .where('article.tag = :tag', { tag })
      .leftJoinAndSelect('article.user', 'user')
      .select(['article'])
      .addSelect(['user.username', 'user.id', 'user.avatarUrl'])
      .getMany();
    return paginate<Article>(queryBuilder, options);
  }

  async getAllArticles(
    options: IPaginationOptions,
  ): Promise<Pagination<Article>> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .select(['article'])
      .addSelect(['user.username', 'user.id', 'user.avatarUrl']);
    queryBuilder.getMany();
    return paginate<Article>(queryBuilder, options);
  }

  async getArticlesByUsername(
    username: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Article>> {
    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.user', 'user')
      .select(['article'])
      .addSelect(['user.username', 'user.id']);
    queryBuilder.where('user.username = :username', { username }).getMany();
    return paginate<Article>(queryBuilder, options);
  }

  async saveArticle(user: User, dto: createArticleDto): Promise<InsertResult> {
    return await this.articleRepository
      .createQueryBuilder()
      .insert()
      .into(Article)
      .values([{ ...dto, user, createdAt: Date.now() }])
      .execute();
  }

  async updateArticle(
    id: number,
    dto: updateArticleDto,
  ): Promise<UpdateResult> {
    return this.articleRepository
      .createQueryBuilder()
      .update(Article)
      .set({ ...dto, updatedAt: Date.now() })
      .where('id = :id', { id })
      .execute();
  }

  async deleteArticle(id: number): Promise<DeleteResult> {
    const deleteResult = await this.articleRepository
      .createQueryBuilder()
      .delete()
      .from(Article)
      .where('id = :id', { id })
      .execute();
    return deleteResult;
  }
}
