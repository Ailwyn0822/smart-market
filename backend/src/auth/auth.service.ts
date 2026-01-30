import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserProvider, User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt'; // 1. 引入
@Injectable()
export class AuthService {
  // 注入 UsersService，這樣我們才能操作資料庫
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthLogin(details: any) {
    // 1. 先去資料庫查，這個 Email 註冊過了嗎？
    const user = await this.usersService.findOneByEmail(details.email);

    // 2. 如果找得到 (User 存在)，直接回傳該使用者
    if (user) {
      // 這裡未來可以加邏輯：如果是用 Google 登入但資料庫紀錄是 Local，要不要幫他合併？
      // 目前先簡單回傳就好
      return user;
    }

    // 3. 如果找不到 (User 不存在)，幫他註冊一個新的
    console.log('User not found. Creating new user...');
    const newUser = await this.usersService.createOAuthUser({
      email: details.email,
      name: `${details.firstName} ${details.lastName}`,
      avatar: details.picture,
      provider: UserProvider.GOOGLE, // 標記他是 Google 來的
      providerId: details.providerId,
    });

    return newUser;
  }

  // 3. 新增發證件方法
  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: 'USER', // 暫時寫死，之後從資料庫讀
    };

    return {
      // 這就是那一串加密亂碼
      access_token: this.jwtService.sign(payload),
      // 順便把基本資料帶回去，方便前端顯示 (但不包含敏感資訊)
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    };
  }
}
