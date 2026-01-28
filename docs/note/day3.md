# Day 3 實作全紀錄：Nuxt 3 前端、LINE 登入與 Tailwind CSS

**專案狀態**：Day 3 完成
**日期**：2026/01/28
**目標**：完成前後端串接、LINE 登入、Tailwind CSS 切版

---

## 1. 後端 (Backend) 修改

### 1.1 啟用 Session (解決 LINE 報錯)
**檔案：** `apps/backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 啟用 Session (LINE Login 必要)
  app.use(
    session({
      secret: 'my-secret', // 任意字串
      resave: false,
      saveUninitialized: false,
    }),
  );

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

### 1.2 設定 LINE 環境變數
**檔案：** `apps/backend/.env`

```env
# ... (原有的 DB 與 Google 設定)

# LINE Auth
LINE_CHANNEL_ID=你的ChannelID
LINE_CHANNEL_SECRET=你的ChannelSecret
LINE_CALLBACK_URL=http://localhost:8080/auth/line/callback
```

### 1.3 補上型別定義
**檔案：** `apps/backend/src/types.d.ts` (新增此檔案)

```typescript
declare module 'passport-line-auth';
```

### 1.4 LINE Strategy (驗證策略)
**檔案：** `apps/backend/src/auth/line.strategy.ts`

```typescript
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-line-auth'; 
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
      scope: ['profile', 'openid', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { displayName, id, pictureUrl, email } = profile;
    // 若無 email 則使用假 email 替代
    const userEmail = email || `line_${id}@smart-market.com`;

    const details = {
      email: userEmail,
      firstName: displayName,
      lastName: '',
      picture: pictureUrl,
      providerId: id,
      accessToken,
    };

    const user = await this.authService.validateOAuthLogin(details);
    done(null, user);
  }
}
```

### 1.5 LINE Guard (守衛)
**檔案：** `apps/backend/src/auth/line-oauth.guard.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LineOAuthGuard extends AuthGuard('line') {}
```

### 1.6 Controller (重導向邏輯)
**檔案：** `apps/backend/src/auth/auth.controller.ts`

```typescript
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { LineOAuthGuard } from './line-oauth.guard';

@Controller('auth')
export class AuthController {
  
  // --- Google ---
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const userData = encodeURIComponent(JSON.stringify(user));
    // 踢回前端
    return res.redirect(`http://localhost:3000?user=${userData}`);
  }

  // --- LINE ---
  @Get('line')
  @UseGuards(LineOAuthGuard)
  async lineAuth() {}

  @Get('line/callback')
  @UseGuards(LineOAuthGuard)
  async lineAuthRedirect(@Req() req: any, @Res() res: Response) {
    const user = req.user;
    const userData = encodeURIComponent(JSON.stringify(user));
    // 踢回前端
    return res.redirect(`http://localhost:3000?user=${userData}`);
  }
}
```

---

## 2. 前端 (Frontend) 設定

### 2.1 Nuxt Config
**檔案：** `apps/client/nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
})
```

### 2.2 Tailwind Config (自訂主題)
**檔案：** `apps/client/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4285F4', // Google Blue
        line: '#06C755',    // LINE Green
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

### 2.3 全域 CSS (引入字型)
**檔案：** `apps/client/assets/css/main.css`

```css
@import url('[https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap](https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap)');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50 text-gray-900;
}
```

### 2.4 主頁面 (App.vue)
**檔案：** `apps/client/app.vue`

```vue
<template>
  <div class="flex min-h-screen flex-col items-center justify-center font-sans">
    
    <h1 class="mb-6 text-3xl font-bold text-gray-800">Smart Market 登入測試</h1>

    <div v-if="!user" class="w-80 rounded-xl bg-white p-8 text-center shadow-lg">
      <p class="mb-4 text-gray-600">請點擊下方按鈕登入</p>
      
      <a href="http://localhost:8080/auth/google" 
         class="mb-3 block w-full rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:opacity-90">
        Google 登入
      </a>

      <a href="http://localhost:8080/auth/line" 
         class="block w-full rounded-lg bg-line px-4 py-2 font-bold text-white transition hover:opacity-90">
        LINE 登入
      </a>
    </div>

    <div v-else class="w-80 rounded-xl bg-white p-8 text-center shadow-lg">
      <img :src="user.avatar" alt="Avatar" class="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-blue-100" />
      <h2 class="mb-2 text-xl font-bold text-gray-800">歡迎回來, {{ user.name }}!</h2>
      <p class="mb-6 break-all text-sm text-gray-500">Email: {{ user.email }}</p>
      <button @click="logout" class="w-full rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600">
        登出
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const route = useRoute();
const user = ref(null);

// 1. 抓取 URL 參數 (Nuxt 自動處理)
const userData = route.query.user;

if (userData) {
  try {
    // 2. 解析 JSON
    user.value = JSON.parse(userData);
    // 3. 清除網址參數
    window.history.replaceState({}, document.title, "/");
  } catch (e) {
    console.error('解析失敗', e);
  }
}

function logout() {
  user.value = null;
}
</script>
```