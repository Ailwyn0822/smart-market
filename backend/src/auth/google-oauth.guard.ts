import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      // 這裡可以設定一些進階參數，目前先留空
      // 繼承 AuthGuard('google') 就會自動去呼叫我們剛剛寫的 GoogleStrategy
    });
  }
}
