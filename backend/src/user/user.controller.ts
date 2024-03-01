import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { mkdirSync, existsSync, unlinkSync, readdirSync } from 'fs';
import { resolve } from 'path';
import * as sharp from 'sharp';

import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { User } from './user.entity';
import { createUserDto } from './dtos/createUserDto';
import { updateUserDto } from './dtos/updateUserDto';
import { hash } from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  // @UseGuards(AuthGuard)
  async getUser(@Param('username') username): Promise<Omit<User, 'pass'>> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    const { pass, ...currentUser } = searchedUser;
    return currentUser;
  }

  @Get('author/:username')
  async getAuthor(
    @Param('username') username,
  ): Promise<
    Pick<User, 'id' | 'username' | 'email' | 'bio' | 'age' | 'gender'>
  > {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${username}`);
    }
    const { pass, createdAt, updatedAt, refresh_token, ...currentUser } =
      searchedUser;
    return currentUser;
  }

  @Post()
  async createUser(@Body() dto: createUserDto): Promise<Omit<User, 'pass'>> {
    const searchedUser = await this.userService.getUser(dto.username);
    if (searchedUser) {
      throw new BadRequestException(`Already has ${searchedUser.username}`);
    }
    const { pass: dtoPass, ...data } = dto;
    const hashPassword = await hash(dtoPass, 10);
    const entity = Object.assign(new User(), {
      ...data,
      pass: hashPassword,
    });
    await this.userService.saveUser(entity);
    const createdUser = await this.userService.getUser(dto.username);
    const { pass, ...currentUser } = createdUser;
    return currentUser;
  }

  @Put(':username')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateUser(
    @Param('username') username,
    @UploadedFile() bio: Express.Multer.File,
    @Body() body: updateUserDto,
  ): Promise<Omit<User, 'pass'>> {
    const searchedUser = await this.userService.getUser(username);
    const { avatar, ext, avatarDate, avatarUrl, ...userInfo } = body;
    const uploadPath = resolve(__dirname, '../../../frontend/dist/avatars');
    if (avatar && ext && avatarDate) {
      readdirSync(uploadPath)
        .filter((path) => {
          if (`${path}`.indexOf(`${searchedUser.username}-`) >= 0) {
            return true;
          }
          return false;
        })
        .forEach((path) => {
          unlinkSync(`${uploadPath}/${path}`);
        });
      const base64Image = body.avatar;
      const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const response = { type: null, data: null };
      response.type = matches[1];
      response.data = Buffer.from(matches[2], 'base64');
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      await sharp(response.data)
        .resize(600, 600)
        .toFile(`${uploadPath}/${username}-${avatarDate}.${ext}`);
    }

    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    const entity = Object.assign(new User(), {
      ...userInfo,
      avatarUrl:
        avatar && ext && avatarDate
          ? `/avatars/${username}-${avatarDate}.${ext}`
          : avatarUrl
            ? avatarUrl
            : null,
      username,
      pass: searchedUser.pass,
    });
    await this.userService.updateUser(entity);
    const updatedUser = await this.userService.getUser(username);
    const { pass, ...currentUser } = updatedUser;
    return currentUser;
  }

  @Put(':username/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async savePreviewUserAvatar(
    @Param('username') username,
    @UploadedFile() bio: Express.Multer.File,
    @Body() body: updateUserDto,
  ): Promise<string> {
    const { avatar, ext, avatarDate } = body;
    const searchedUser = await this.userService.getUser(username);
    const uploadPath = resolve(__dirname, '../../../frontend/dist/avatars');
    readdirSync(uploadPath)
      .filter((path) => {
        if (`${searchedUser?.avatarUrl}`.replace('/avatars/', '') === path) {
          return false;
        }
        if (`${path}`.indexOf(`${searchedUser.username}-`) >= 0) {
          return true;
        }
        return false;
      })
      .forEach((path) => {
        unlinkSync(`${uploadPath}/${path}`);
      });

    const base64Image = body.avatar;
    const matches = base64Image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const response = { type: null, data: null };
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }
    await sharp(response.data)
      .resize(600, 600)
      .toFile(`${uploadPath}/${username}-${avatarDate}.${ext}`);
    return 'Avatar success updated';
  }

  @Delete(':username/avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateUserAvatar(
    @Param('username') username,
    @UploadedFile() bio: Express.Multer.File,
    @Body() body: updateUserDto,
  ): Promise<string> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Already has ${searchedUser.username}`);
    }

    const { avatarDate } = body;
    const uploadPath = resolve(__dirname, '../../../frontend//dist/avatars');

    readdirSync(uploadPath)
      .filter((path) => {
        if (`${path}`.indexOf(`${searchedUser.username}-`) >= 0) {
          return true;
        }
        return false;
      })
      .forEach((path) => {
        unlinkSync(`${uploadPath}/${path}`);
      });

    const entity = Object.assign(new User(), {
      ...searchedUser,
      avatarUrl: null,
    });
    await this.userService.updateUser(entity);

    return 'Avatar success deleted';
  }

  @Delete(':username')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('username') username): Promise<Omit<User, 'pass'>> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    await this.userService.deleteUser(username);
    const { pass, ...currentUser } = searchedUser;
    return currentUser;
  }
}
