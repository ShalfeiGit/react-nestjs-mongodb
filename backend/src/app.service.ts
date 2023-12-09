import { Injectable } from '@nestjs/common';

export interface IUser {
  name: string;
  email: string;
  bio: string;
  age: number;
  gender: string;
}

@Injectable()
export class AppService {
  getHello(): IUser {
    return {
      name: 'Valentin',
      email: 'someadress3000@gmail.com',
      bio: 'Best man',
      age: 35,
      gender: 'male',
    };
  }
}
