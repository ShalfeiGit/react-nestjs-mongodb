import { Global, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { UserController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Article, User])],
  controllers: [UserController],
  providers: [ArticleService, UserService],
  exports: [ArticleService],
})
export class ArticleModule {}
