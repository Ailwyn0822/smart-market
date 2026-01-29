# Day 4 實作全紀錄：JWT 驗證、Pinia 狀態管理與 Admin 後台建置

**專案狀態**：Day 4 完成
**日期**：2026/01/29
**目標**：將系統升級為 JWT 驗證、解決前端登入狀態持久化、初始化後台架構。

---

## 1. 後端 (Backend) - JWT 實作

### 1.1 安裝依賴
```bash
cd apps/backend
npm install @nestjs/jwt passport-jwt
npm install -D @types/passport-jwt
```

### 1.2 設定環境變數
**檔案：** `apps/backend/.env`
```env
# ... 其他設定
JWT_SECRET=super-secret-smart-market-key-2026
JWT_EXPIRATION=1d
```

### 1.3 建立 JWT Strategy (驗票員)
**檔案：** `apps/backend/src/auth/jwt.strategy.ts`
```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

### 1.4 更新 Auth Module
**檔案：** `apps/backend/src/auth/auth.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; // 引入
// ... 其他 imports
import { JwtStrategy } from './jwt.strategy'; // 引入

@Module({
  imports: [
    // ... 其他 imports
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, LineStrategy, JwtStrategy], // 加入 Strategy
})
export class AuthModule {}
```

### 1.5 更新 Auth Service (簽發 Token)
**檔案：** `apps/backend/src/auth/auth.service.ts`
```typescript
// ... imports
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // 注入
  ) {}

  // ... validateOAuthLogin ...

  async login(user: User) {
    const payload = { 
        email: user.email, 
        sub: user.id,
        role: 'USER' 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }
    };
  }
}
```

### 1.6 更新 Auth Controller (回傳 Token)
**檔案：** `apps/backend/src/auth/auth.controller.ts`
```typescript
// ...
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { access_token, user } = await this.authService.login(req.user);
    // 改為回傳 Token
    const redirectUrl = `http://localhost:3000?token=${access_token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    return res.redirect(redirectUrl);
  }
// LINE 部分同理修改
```

---

## 2. 前台 (Client) - Pinia 與狀態持久化

### 2.1 安裝與設定
```bash
cd apps/client
npm install @pinia/nuxt pinia
```
**檔案：** `apps/client/nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  // ...
})
```

### 2.2 建立 Auth Store
**檔案：** `apps/client/stores/auth.ts`
```typescript
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token');
  const user = useCookie<any>('auth_user');

  const login = (newToken: string, userData: any) => {
    token.value = newToken;
    user.value = userData;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    navigateTo('/');
  };

  return { token, user, login, logout };
});
```

### 2.3 修正 Hydration Mismatch (App.vue)
使用 `<ClientOnly>` 與 `onMounted` 解決 SSR 渲染不同步問題。

**檔案：** `apps/client/app.vue`
```vue
<template>
  <div class="flex min-h-screen flex-col items-center justify-center font-sans">
    <h1 class="mb-6 text-3xl font-bold text-gray-800">Smart Market 登入測試</h1>

    <ClientOnly>
      <template #fallback><div>載入中...</div></template>

      <div v-if="!authStore.user" class="...">
         </div>

      <div v-else class="...">
         <button @click="authStore.logout">登出</button>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  const tokenParam = route.query.token;
  const userParam = route.query.user;
  if (tokenParam && userParam) {
    try {
      authStore.login(tokenParam, JSON.parse(userParam));
      window.history.replaceState({}, document.title, "/");
    } catch (e) { console.error(e); }
  }
});
</script>
```

---

## 3. 後台 (Admin) - 初始化 Vue 3 + Element Plus

### 3.1 建立專案
```bash
# 在根目錄執行
npm create vue@latest apps/admin
# 選項：TypeScript (Yes), Router (Yes), Pinia (Yes), ESLint/Prettier (Yes), 其餘 No
cd apps/admin
npm install
```

### 3.2 安裝 Element Plus 與自動引入
```bash
npm install element-plus
npm install -D unplugin-vue-components unplugin-auto-import
```

### 3.3 設定 Vite Config
**檔案：** `apps/admin/vite.config.ts`
```typescript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 4000 }
})
```

---

## 4. 根目錄 (Root) - 一鍵啟動

### 4.1 初始化與安裝
```bash
# 在 smart-market 根目錄
npm init -y
npm install -D concurrently
```

### 4.2 設定 package.json
**檔案：** `package.json`
```json
{
  "name": "smart-market-root",
  "scripts": {
    "dev": "concurrently -n \"BACKEND,CLIENT,ADMIN\" -c \"blue,green,magenta\" \"npm run start:dev --prefix apps/backend\" \"npm run dev --prefix apps/client\" \"npm run dev --prefix apps/admin\""
  }
  // ...
}
```

---