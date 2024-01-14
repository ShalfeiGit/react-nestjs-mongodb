import { Injectable } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Article, TagArticle } from './article.entity';
import { createArticleDto } from './dtos/createArticleDto';
import { updateArticleDto } from './dtos/updateArticleDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

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
      .getOne();
  }

  async getArticlesByTag(tag: TagArticle): Promise<Article[]> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.tag = :tag', { tag })
      .getMany();
  }

  async getArticlesByUsername(username: string): Promise<Article[]> {
    return await this.articleRepository
      .createQueryBuilder('article')
      .where('article.user.username = :username', { username })
      .getMany();
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
