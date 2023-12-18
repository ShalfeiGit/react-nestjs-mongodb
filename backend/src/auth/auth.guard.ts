import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  async validateRequest(request): Promise<boolean> {
    const payload = verify(
      request.signedCookies['access_token'],
      process.env.JWT_SECRET_SALT,
    );
    console.log(payload);
    if (true) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
}
