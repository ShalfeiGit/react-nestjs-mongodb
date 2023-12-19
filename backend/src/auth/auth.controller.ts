import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { loginUserDto } from './dtos/loginUserDto';
import { AuthService } from './auth.service';
import { compare } from 'bcrypt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: loginUserDto,
  ): Promise<User> {
    const { username, password, refreshToken } = dto;
    if (!((username && password) || refreshToken)) {
      throw new BadRequestException('Username or password incorrect');
    }
    let accessTokenData;
    if (refreshToken) {
      accessTokenData = await this.authService.updateTokens(refreshToken);
      const user = await this.userService.getUser(accessTokenData.username);
      if (!user) {
        throw new BadRequestException('Username or password incorrect');
      }
      const hasAccess = await compare(password, user.password);
      if (!hasAccess) {
        throw new BadRequestException('Username or password incorrect');
      }
      response.cookie('access_token', `${accessTokenData.access_token}`, {
        httpOnly: true,
        secure: true,
        signed: true,
        expires: new Date(Date.now() + 30 * 24 * 3600000),
      });
      response.set('refresh_token', `${accessTokenData.refresh_token}`);
      return user;
    } else {
      const user = await this.userService.getUser(username);
      if (!user) {
        throw new BadRequestException('Username or password incorrect');
      }
      const hasAccess = await compare(password, user.password);
      if (!hasAccess) {
        throw new BadRequestException('Username or password incorrect');
      }
      accessTokenData = await this.authService.signIn(username, password);
      response.cookie('access_token', `${accessTokenData.access_token}`, {
        httpOnly: true,
        secure: true,
        signed: true,
        expires: new Date(Date.now() + 3600000),
      });
      response.set('refresh_token', `${accessTokenData.refresh_token}`);
      return user;
    }
  }
}
