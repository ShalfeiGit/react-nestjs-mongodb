import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateRequest(request): Promise<boolean> {
    if (
      request?.path === '/api/auth' &&
      request?.body?.pass &&
      request?.body?.username
    ) {
      return true;
    }

    if (request?.body?.refresh_token) {
      const refresh_token = request?.body?.refresh_token;
      const payload = verify(refresh_token, process.env.JWT_SECRET_SALT);
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.username = :username', {
          username: (payload as JwtPayload)?.username,
        })
        .getOne();
      if (refresh_token !== user?.refresh_token) {
        throw new UnauthorizedException();
      }
      return true;
    }

    if (request.signedCookies['access_token']) {
      const payload = verify(
        request.signedCookies['access_token'],
        process.env.JWT_SECRET_SALT,
      );
      const generateIatWithMS = (payload as JwtPayload)?.expired;
      if (generateIatWithMS - Date.now() < 0) {
        throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
}
