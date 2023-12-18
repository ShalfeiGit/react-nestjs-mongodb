import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  async signIn(username, password) {
    const payloadToken = { username };
    const payloadTokenRefresh = { password, username };
    return {
      access_token: sign(payloadToken, process.env.JWT_SECRET_SALT),
      refresh_token: sign(payloadTokenRefresh, 'Custom_secret_value'),
    };
  }
}
