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
  ): Promise<Omit<User, 'password'> & { refresh_token: string }> {
    const { username, password, refresh_token } = dto;
    if (!((username && password) || refresh_token)) {
      throw new BadRequestException('Username or password incorrect');
    }
    let accessTokenData;
    if (refresh_token) {
      accessTokenData = await this.authService.updateTokens(refresh_token);
      const user = await this.userService.getUser(accessTokenData.username);
      if (!user) {
        throw new BadRequestException('Username or password incorrect');
      }
      const hasAccess = await compare(accessTokenData.password, user.password);
      if (!hasAccess) {
        throw new BadRequestException('Username or password incorrect');
      }
      response.cookie('access_token', `${accessTokenData.access_token}`, {
        httpOnly: true,
        secure: true,
        signed: true,
        expires: new Date(Date.now() + 30 * 24 * 3600000),
      });
      const { password: userPassword, ...enrichedUser } = user;
      return {
        ...enrichedUser,
        refresh_token: `${accessTokenData.refresh_token}`,
      };
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
      const { password: userPassword, ...enrichedUser } = user;
      return {
        ...enrichedUser,
        refresh_token: `${accessTokenData.refresh_token}`,
      };
    }
  }
}
