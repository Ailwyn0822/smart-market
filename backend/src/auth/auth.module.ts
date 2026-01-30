import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy'; // 1. 引入策略
import { PassportModule } from '@nestjs/passport'; // 2. 引入 Passport
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module'; // 1. 引入
import { LineStrategy } from './line.strategy'; // 1. 引入
import { JwtStrategy } from './jwt.strategy'; // 2. 引入
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule, // 為了讀 .env
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy, // 3. 註冊策略 (重要！)
    LineStrategy,
    JwtStrategy,
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
