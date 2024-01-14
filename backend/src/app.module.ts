import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './ormconfig';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend/dist'),
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ArticleModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [UserModule],
})
export class AppModule {}
