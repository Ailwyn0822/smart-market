import { Controller, Get, Post, Req, Res, Body, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { LineOAuthGuard } from './line-oauth.guard';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async localLogin(@Body() body: { email: string; password: string }) {
    return this.authService.loginWithCredentials(body.email, body.password);
  }

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
  async lineAuth() {}

  // 🟢 LINE 回歸門
  @Get('line/callback')
  @UseGuards(LineOAuthGuard)
  async lineAuthRedirect(@Req() req: any, @Res() res: any) {
    const { access_token, user } = await this.authService.login(req.user);
    const redirectUrl = `http://localhost:3000?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return res.redirect(redirectUrl);
  }
}
