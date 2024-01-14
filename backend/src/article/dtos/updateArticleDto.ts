import { TagArticle } from '../article.entity';

export class updateArticleDto {
  readonly title?: string;
  readonly content?: string;
  readonly tag?: keyof typeof TagArticle;
  readonly likes?: number;
}
