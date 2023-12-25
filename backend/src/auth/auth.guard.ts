import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  async validateRequest(request): Promise<boolean> {
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
