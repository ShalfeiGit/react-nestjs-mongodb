import { UserGender } from '../user.entity';

export class updateUserDto {
  readonly password?: string;
  readonly username?: string;
  readonly email?: string;
  readonly bio?: string;
  readonly age?: number;
  readonly gender?: keyof typeof UserGender;
}
