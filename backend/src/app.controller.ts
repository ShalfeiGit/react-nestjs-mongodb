import { Controller, Get } from '@nestjs/common';
import { AppService, IUser } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('login')
  getHello(): IUser {
    return this.appService.getHello();
  }
}
