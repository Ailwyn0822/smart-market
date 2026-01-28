import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy'; // 1. 引入策略
import { PassportModule } from '@nestjs/passport'; // 2. 引入 Passport
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module'; // 1. 引入
import { LineStrategy } from './line.strategy'; // 1. 引入

@Module({
  imports: [
    ConfigModule, // 為了讀 .env
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy, // 3. 註冊策略 (重要！)
    LineStrategy,
  ],
})
export class AuthModule {}
