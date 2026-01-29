import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { LineOAuthGuard } from './line-oauth.guard'; // 1. 引入
import { AuthService } from './auth.service'; // 1. 引入 Service
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // 這裡一樣不動，負責踢去 Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  // 注意：這裡多加了 @Res() res，讓我們可以控制跳轉
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const { access_token, user } = await this.authService.login(req.user);
    const redirectUrl = `http://localhost:3000?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return res.redirect(redirectUrl);
  }

  // 🟢 LINE 出發門
  @Get('line')
  @UseGuards(LineOAuthGuard)
  async lineAuth() { }

  // 🟢 LINE 回歸門
  @Get('line/callback')
  @UseGuards(LineOAuthGuard)
  async lineAuthRedirect(@Req() req: any, @Res() res: any) {
    const { access_token, user } = await this.authService.login(req.user);
    const redirectUrl = `http://localhost:3000?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return res.redirect(redirectUrl);
  }
}
