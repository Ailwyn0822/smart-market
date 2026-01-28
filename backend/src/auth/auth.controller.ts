import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { LineOAuthGuard } from './line-oauth.guard'; // 1. 引入

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // 這裡一樣不動，負責踢去 Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  // 注意：這裡多加了 @Res() res，讓我們可以控制跳轉
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const user = req.user;

    // --- 關鍵修改 ---
    // 我們不直接回傳 JSON，而是將使用者「重新導向 (Redirect)」回前端 (localhost:3000)
    // 並且把使用者的資料，暫時編成字串 (Query String) 帶過去
    // 注意：這只是為了 Day 3 教學展示用的簡單做法，正式上線我們會用 JWT (Day 4 會教)

    // 把資料轉成 JSON 字串並編碼 (避免中文亂碼)
    const userData = encodeURIComponent(JSON.stringify(user));

    // 踢回前端首頁，並附帶 user 參數
    return res.redirect(`http://localhost:3000?user=${userData}`);
  }

  // 🟢 LINE 出發門
  @Get('line')
  @UseGuards(LineOAuthGuard)
  async lineAuth() {}

  // 🟢 LINE 回歸門
  @Get('line/callback')
  @UseGuards(LineOAuthGuard)
  async lineAuthRedirect(@Req() req: any, @Res() res: any) {
    const user = req.user;
    const userData = encodeURIComponent(JSON.stringify(user));
    // 一樣踢回前端，邏輯跟 Google 完全一樣
    return res.redirect(`http://localhost:3000?user=${userData}`);
  }
}
