import { Controller, Get, Post, Req, Res, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { LineOAuthGuard } from './line-oauth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '本地帳號註冊', description: '使用 email/password 建立新帳號，成功後自動登入' })
  @ApiResponse({ status: 201, description: '註冊成功，回傳 access_token 和用戶資訊' })
  @ApiResponse({ status: 409, description: '此 Email 已被使用' })
  async localRegister(@Body() body: { username: string; email: string; password: string }) {
    return this.authService.registerLocal(body.username, body.email, body.password);
  }

  @Post('login')
  @ApiOperation({ summary: '本地帳密登入' })
  @ApiResponse({ status: 200, description: '登入成功，回傳 access_token 和用戶資訊' })
  @ApiResponse({ status: 401, description: '帳號或密碼錯誤' })
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
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const redirectUrl = `${frontendUrl}?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`;
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
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const redirectUrl = `${frontendUrl}?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return res.redirect(redirectUrl);
  }
}
