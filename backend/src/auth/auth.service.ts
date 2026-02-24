import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserProvider, User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(details: any) {
    const user = await this.usersService.findOneByEmail(details.email);

    if (user) {
      return user;
    }

    console.log('User not found. Creating new user...');
    const newUser = await this.usersService.createOAuthUser({
      email: details.email,
      name: `${details.firstName} ${details.lastName}`,
      avatar: details.picture,
      provider: UserProvider.GOOGLE,
      providerId: details.providerId,
    });

    return newUser;
  }

  // 本地帳號註冊
  async registerLocal(name: string, email: string, password: string) {
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) {
      throw new ConflictException('此 Email 已被使用');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createOAuthUser({
      name,
      email,
      password: hashed,
      provider: UserProvider.LOCAL,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email)}`,
    });
    return this.login(user);
  }

  // 本地帳密登入
  async loginWithCredentials(email: string, password: string) {
    const user = await this.usersService.findOneByEmailWithPassword(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('帳號或密碼錯誤');
    }
    return this.login(user);
  }

  // 發 JWT Token
  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role, // 從資料庫讀取角色（UserRole.USER 或 UserRole.ADMIN）
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }
}
