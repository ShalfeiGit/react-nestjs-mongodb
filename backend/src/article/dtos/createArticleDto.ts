import { User } from 'src/user/user.entity';
import { TagArticle } from '../article.entity';

export class createArticleDto {
  readonly title: string;
  readonly content: string;
  readonly tag: keyof typeof TagArticle;
}
