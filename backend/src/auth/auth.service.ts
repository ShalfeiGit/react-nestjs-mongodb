import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  async signIn(username, pass) {
    const payloadToken = {
      createdDate: Date.now(),
      username,
      expired: Date.now() + 10000,
    };
    const payloadTokenRefresh = {
      createdDate: Date.now(),
      pass,
      username,
    };
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
      expired: Date.now() + 10000,
    };
    const payloadTokenRefresh = {
      createdDate: Date.now(),
      pass: (decode as JwtPayload)?.pass,
      username: (decode as JwtPayload)?.username,
    };

    return {
      pass: (decode as JwtPayload)?.pass,
      username: (decode as JwtPayload)?.username,
      access_token: sign(payloadToken, process.env.JWT_SECRET_SALT),
      refresh_token: sign(payloadTokenRefresh, process.env.JWT_SECRET_SALT),
    };
  }
}
