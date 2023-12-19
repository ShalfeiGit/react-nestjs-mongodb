import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  async signIn(username, password) {
    const payloadToken = { createdDate: Date.now(), username };
    const payloadTokenRefresh = { createdDate: Date.now(), password, username };
    return {
      access_token: sign(payloadToken, process.env.JWT_SECRET_SALT),
      refresh_token: sign(payloadTokenRefresh, process.env.JWT_SECRET_SALT),
    };
  }

  async updateTokens(refreshToken) {
    const decode = verify(refreshToken, process.env.JWT_SECRET_SALT);
    const payloadToken = {
      createdDate: Date.now(),
      username: (decode as JwtPayload)?.username,
    };
    const payloadTokenRefresh = {
      createdDate: Date.now(),
      password: (decode as JwtPayload)?.password,
      username: (decode as JwtPayload)?.username,
    };

    return {
      password: (decode as JwtPayload)?.password,
      username: (decode as JwtPayload)?.username,
      access_token: sign(payloadToken, process.env.JWT_SECRET_SALT),
      refresh_token: sign(payloadTokenRefresh, process.env.JWT_SECRET_SALT),
    };
  }
}
