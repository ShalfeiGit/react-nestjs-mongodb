import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  Put,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';

import { ArticleService } from './article.service';
import { Article, TagArticle } from './article.entity';
import { createArticleDto } from './dtos/createArticleDto';
import { updateArticleDto } from './dtos/updateArticleDto';
import { hash } from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Controller('article')
export class UserController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  @Get('/:id')
  async getArticleById(@Param('id') id): Promise<Article> {
    const searchedArticle = await this.articleService.getArticleById(id);
    if (!searchedArticle) {
      throw new BadRequestException(`Not found article with id:${id}`);
    }
    return {
      ...searchedArticle,
      createdAt: Number(searchedArticle.createdAt),
      updatedAt: searchedArticle?.updatedAt
        ? Number(searchedArticle?.updatedAt)
        : null,
    };
  }

  @Get('group/:tag')
  async getArticlesByTag(
    @Param('tag') tag,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Article>> {
    const searchedArticles = await this.articleService.getArticlesByTag(tag, {
      page,
      limit,
    });
    return searchedArticles;
  }

  @Get('global/:id')
  async getAllArticles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Article>> {
    const searchedArticles = await this.articleService.getAllArticles({
      page,
      limit,
    });
    return searchedArticles;
  }

  @Get('filter/:username')
  async getArticlesByUsername(
    @Param('username') username,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Article>> {
    const searchedArticles = await this.articleService.getArticlesByUsername(
      username,
      {
        page,
        limit,
      },
    );
    return searchedArticles;
  }

  @Get('options/tag')
  async getTagOptions(): Promise<{ label: string; value: string }[]> {
    return (
      Object.values(JSON.parse(JSON.stringify(TagArticle ?? {}))) as string[]
    ).map((item) => ({ label: item, value: item }));
  }

  @Post(':username')
  @UseGuards(AuthGuard)
  async createArticle(
    @Param('username') username,
    @Body() dto: createArticleDto,
  ): Promise<Article> {
    const user = await this.userService.getUser(username);
    const createdArticle = await this.articleService.saveArticle(user, dto);
    const article = await this.articleService.getArticleById(
      createdArticle.raw.insertId,
    );
    return article;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('id') id,
    @Body() dto: updateArticleDto,
  ): Promise<Article> {
    const searchedArticle = await this.articleService.getArticleById(id);
    if (!searchedArticle) {
      throw new BadRequestException(`Not found article with id:${id}`);
    }
    await this.articleService.updateArticle(id, dto);
    const article = await this.articleService.getArticleById(id);
    return article;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('id') id): Promise<Article> {
    const searchedArticle = await this.articleService.getArticleById(id);
    if (!searchedArticle) {
      throw new BadRequestException(`Not found article with id:${id}`);
    }
    await this.articleService.deleteArticle(id);
    return searchedArticle;
  }

  @Post('like/:id/username/:username')
  @UseGuards(AuthGuard)
  async likeArticle(
    @Param('username') username,
    @Param('id') id,
    @Body() dto: Pick<updateArticleDto, 'likes'>,
  ): Promise<Omit<User, 'pass' | 'updatedAt' | 'createdAt' | 'refresh_token'>> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    const article = await this.articleService.getArticleById(id);
    const entity = Object.assign(new User(), {
      ...searchedUser,
      likedArticle:
        `${article.likes}` > `${dto.likes}`
          ? [
              ...(searchedUser.likedArticle ?? []).filter(
                (article) => `${article.id}` !== `${id}`,
              ),
            ]
          : (searchedUser.likedArticle ?? []).some(
                (article) => `${article.id}` === `${id}`,
              )
            ? [...(searchedUser.likedArticle ?? [])]
            : [...(searchedUser.likedArticle ?? []), article],
    });
    await this.userService.likeUser(entity);
    await this.articleService.updateArticle(id, dto);
    const { pass, updatedAt, createdAt, refresh_token, ...currentUser } =
      entity;
    return currentUser;
  }
}
