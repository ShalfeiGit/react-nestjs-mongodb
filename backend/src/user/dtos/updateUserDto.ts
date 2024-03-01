import { Article } from 'src/article/article.entity';
import { UserGender } from '../user.entity';

export class updateUserDto {
  readonly avatar?: string;
  readonly avatarDate?: string;
  readonly ext?: string;
  readonly avatarUrl?: string;
  readonly email?: string;
  readonly bio?: string;
  readonly age?: number;
  readonly gender?: keyof typeof UserGender;
  readonly refresh_token?: string;
  readonly articles?: Article[];
  readonly likedArticles?: Article[];
}
