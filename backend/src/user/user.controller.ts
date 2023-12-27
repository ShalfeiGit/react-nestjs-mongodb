import {
  Controller,
  Get,
  Patch,
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
  async getUser(@Param('username') username): Promise<User | string> {
    //дополнить проверкой из Passportjs
    const response = await this.userService.getUser(username);
    return response ?? `User ${username} not found `;
  }

  @Post()
  async createUser(@Body() dto: createUserDto) {
    const user = await this.userService.getUser(dto.username);
    if (user?.username) {
      throw new BadRequestException(`Already has ${user.username}`);
    }
    const { password, ...data } = dto;
    const hashPassword = await hash(password, 10);
    const entity = Object.assign(new User(), {
      ...data,
      password: hashPassword,
    });
    await this.userService.saveUser(entity);
    return `${dto.username} was created`;
  }

  @Put(':username')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('username') username,
    @Body() dto: updateUserDto,
  ): Promise<string> {
    //дополнить проверкой из Passportjs
    const user = await this.userService.getUser(username); //дополнить проверкой из Passportjs
    if (!user) {
      return `User ${username} not found `;
    }
    const entity = Object.assign(new User(), {
      ...dto,
      username,
      password: user.password,
    });
    await this.userService.updateUser(username, entity);
    return `${username} was updated`;
  }

  @Delete(':username')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('username') username): Promise<string> {
    const user = await this.userService.getUser(username); //дополнить проверкой из Passportjs
    if (!user) {
      return `User ${username} not found `;
    }
    await this.userService.deleteUser(username);
    return `${username} was deleted`;
  }
  // @Get('errorStatus')
  // async getUser1() {
  //   //дополнить проверкой из Passportjs
  //   throw new BadRequestException(`Already has errror`);
  // }
}
