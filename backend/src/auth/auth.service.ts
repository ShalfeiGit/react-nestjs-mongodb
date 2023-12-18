import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, password) {
    const payloadToken = { username };
    const payloadTokenRefresh = { password, username };
    return {
      access_token: await this.jwtService.signAsync(payloadToken),
      refresh_token: await this.jwtService.signAsync(payloadTokenRefresh),
    };
  }
}
