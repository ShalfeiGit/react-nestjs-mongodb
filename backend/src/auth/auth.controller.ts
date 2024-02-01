import {
  Controller,
  Post,
  Body,
  Res,
  BadRequestException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { loginUserDto } from './dtos/loginUserDto';
import { AuthService } from './auth.service';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: loginUserDto,
  ): Promise<Omit<User, 'pass'> & { refresh_token: string }> {
    const { username, pass, refresh_token } = dto;
    response.status(HttpStatus.OK);
    let accessTokenData;
    if (refresh_token) {
      accessTokenData = await this.authService.updateTokens(refresh_token);
      const user = await this.userService.getUser(accessTokenData.username);

      if (!user) {
        throw new BadRequestException('Username or password incorrect');
      }
      const hasAccess = await compare(accessTokenData.pass, user.pass);
      if (!hasAccess) {
        throw new BadRequestException('Username or password incorrect');
      }
      response.cookie('access_token', `${accessTokenData.access_token}`, {
        httpOnly: true,
        secure: true,
        signed: true,
      });
      const { pass: userPassword, ...enrichedUser } = user;
      await this.userService.updateUser({
        ...user,
        refresh_token: `${accessTokenData.refresh_token}`,
      });
      return {
        ...enrichedUser,
        refresh_token: `${accessTokenData.refresh_token}`,
      };
    } else {
      const user = await this.userService.getUser(username);
      if (!user) {
        throw new BadRequestException('Username or password incorrect');
      }
      const hasAccess = await compare(pass, user.pass);
      if (!hasAccess) {
        throw new BadRequestException('Username or password incorrect');
      }
      accessTokenData = await this.authService.signIn(username, pass);
      response.cookie('access_token', `${accessTokenData.access_token}`, {
        httpOnly: true,
        secure: true,
        signed: true,
      });
      const { pass: userPassword, ...enrichedUser } = user;
      await this.userService.updateUser({
        ...user,
        refresh_token: `${accessTokenData.refresh_token}`,
      });
      return {
        ...enrichedUser,
        refresh_token: `${accessTokenData.refresh_token}`,
      };
    }
  }
}
