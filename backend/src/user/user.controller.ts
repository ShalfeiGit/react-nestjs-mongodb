import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { createUserDto } from './dtos/createUserDto';
import { updateUserDto } from './dtos/updateUserDto';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get(':username')
  async getUser(@Param('username') username): Promise<User | string> {
    //дополнить проверкой из Passportjs
    const response = await this.appService.getUser(username);
    return response ?? `User ${username} not found `;
  }

  @Post()
  async createUser(@Body() dto: createUserDto): Promise<string> {
    const user = await this.appService.getUser(dto.username);
    if (user?.username) {
      return `Already has ${user.username}`;
    }
    await this.appService.saveUser(dto);
    return `${dto.username} was created`;
  }

  @Patch(':username')
  async updateUser(
    @Param('username') username,
    @Body() dto: updateUserDto,
  ): Promise<string> {
    //дополнить проверкой из Passportjs
    const user = await this.appService.getUser(username); //дополнить проверкой из Passportjs
    if (!user) {
      return `User ${username} not found `;
    }
    await this.appService.updateUser(username, { ...dto });
    return `${username} was updated`;
  }

  @Delete(':username')
  async deleteUser(@Param('username') username): Promise<string> {
    const user = await this.appService.getUser(username); //дополнить проверкой из Passportjs
    if (!user) {
      return `User ${user.username} not found `;
    }
    await this.appService.deleteUser(username);
    return `${username} was deleted`;
  }
}
