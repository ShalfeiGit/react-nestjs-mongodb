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
  Patch,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
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
  @UseGuards(AuthGuard)
  async getArticleById(@Param('id') id): Promise<Article> {
    const searchedArticle = await this.articleService.getArticleById(id);
    if (!searchedArticle) {
      throw new BadRequestException(`Not found article with id:${id}`);
    }
    return searchedArticle;
  }

  @Get('group/:tag')
  @UseGuards(AuthGuard)
  async getArticlesByTag(@Param('tag') tag): Promise<Article[]> {
    const searchedArticles = await this.articleService.getArticlesByTag(tag);
    return searchedArticles;
  }

  @Get('sort/:username')
  @UseGuards(AuthGuard)
  async getArticlesByUsername(@Param('username') username): Promise<Article[]> {
    const searchedArticles =
      await this.articleService.getArticlesByUsername(username);
    return searchedArticles;
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
    await this.userService.updateUser(user.username, {
      ...user,
      articles: [...user.articles, article],
    });
    return article;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateArticle(
    @Param('id') id,
    @Body() dto: updateArticleDto,
  ): Promise<Article> {
    const searchedArticle = await this.articleService.getArticleById(id);
    if (searchedArticle) {
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

  @Put('like/:id/username/:username')
  @UseGuards(AuthGuard)
  async likeArticle(
    @Param('username') username,
    @Param('id') id,
    @Body() dto: Omit<updateArticleDto, 'likes'>,
  ): Promise<
    Omit<User, 'password' | 'updatedAt' | 'createdAt' | 'refresh_token'>
  > {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    const article = await this.articleService.getArticleById(id);
    const entity = Object.assign(new User(), {
      ...searchedUser,
      liked: searchedUser.liked.some((article) => `${article.id}` === `${id}`)
        ? searchedUser.liked.filter((article) => `${article.id}` !== `${id}`)
        : [...searchedUser.liked, article],
    });
    await this.userService.updateUser(username, entity);
    const { password, updatedAt, createdAt, refresh_token, ...currentUser } =
      entity;
    return currentUser;
  }
}
