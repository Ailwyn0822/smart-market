import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-line-auth';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class LineStrategy extends PassportStrategy(Strategy, 'line') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      channelID: configService.get<string>('LINE_CHANNEL_ID'),
      channelSecret: configService.get<string>('LINE_CHANNEL_SECRET'),
      callbackURL: configService.get<string>('LINE_CALLBACK_URL'),
      //這三個是我們要跟 LINE 要的資料
      scope: ['profile', 'openid', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { displayName, id, pictureUrl, email } = profile;
    
    // 💡 LINE 的坑：
    // 如果你沒有在 Console 申請 Email 權限，這裡的 email 會是 undefined。
    // 為了不讓資料庫報錯，我們做一個「備用方案」：
    // 如果沒 Email，就用 "line_使用者ID@smart-market.com" 當作假 Email。
    const userEmail = email || `line_${id}@smart-market.com`;

    const details = {
      email: userEmail,
      firstName: displayName,
      lastName: '', // LINE 只有一個名字，沒有分姓氏
      picture: pictureUrl,
      providerId: id,
      accessToken,
    };

    const user = await this.authService.validateOAuthLogin(details);
    done(null, user);
  }
}
