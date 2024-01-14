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
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { createUserDto } from './dtos/createUserDto';
import { updateUserDto } from './dtos/updateUserDto';
import { hash } from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  @UseGuards(AuthGuard)
  async getUser(@Param('username') username): Promise<Omit<User, 'password'>> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    const { password, ...currentUser } = searchedUser;
    return currentUser;
  }

  @Get('author/:username')
  @UseGuards(AuthGuard)
  async getAuthor(
    @Param('username') username,
  ): Promise<
    Pick<User, 'id' | 'username' | 'email' | 'bio' | 'age' | 'gender'>
  > {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${username}`);
    }
    const { password, createdAt, updatedAt, refresh_token, ...currentUser } =
      searchedUser;
    return currentUser;
  }

  @Post()
  async createUser(
    @Body() dto: createUserDto,
  ): Promise<Omit<User, 'password'>> {
    const searchedUser = await this.userService.getUser(dto.username);
    if (searchedUser) {
      throw new BadRequestException(`Already has ${searchedUser.username}`);
    }
    const { password: pass, ...data } = dto;
    const hashPassword = await hash(pass, 10);
    const entity = Object.assign(new User(), {
      ...data,
      password: hashPassword,
    });
    await this.userService.saveUser(entity);
    const { password, ...currentUser } = entity;
    return currentUser;
  }

  @Put(':username')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('username') username,
    @Body() dto: updateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    const entity = Object.assign(new User(), {
      ...dto,
      username,
      password: searchedUser.password,
    });
    await this.userService.updateUser(username, entity);
    const { password, ...currentUser } = entity;
    return currentUser;
  }

  @Delete(':username')
  @UseGuards(AuthGuard)
  async deleteUser(
    @Param('username') username,
  ): Promise<Omit<User, 'password'>> {
    const searchedUser = await this.userService.getUser(username);
    if (!searchedUser) {
      throw new BadRequestException(`Not found ${searchedUser.username}`);
    }
    await this.userService.deleteUser(username);
    const { password, ...currentUser } = searchedUser;
    return currentUser;
  }
}
