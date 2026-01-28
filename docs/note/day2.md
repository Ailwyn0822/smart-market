# Day 2: 後端架構與 Google OAuth 實作 (NestJS + Postgres)

## 1. 專案初始化與套件安裝

請在終端機 (Terminal) 依序執行以下指令：

```bash
# 1. 建立專案
# --strict: 開啟 TypeScript 嚴格模式 (Strict Mode)，強迫寫出更安全的程式碼
npm i -g @nestjs/cli
nest new ./backend --strict

# 2. 進入資料夾
cd ./backend

# 3. 安裝資料庫套件
# pg: PostgreSQL 的底層驅動 (司機)
# typeorm: 讓你可以用物件操作資料庫 (翻譯官)
# @nestjs/typeorm: NestJS 的官方整合模組 (外交官)
# @nestjs/config: 用來讀取 .env 檔案 (保險箱管理員)
npm install @nestjs/typeorm typeorm pg @nestjs/config

# 4. 安裝驗證套件
# bcrypt: 密碼加密工具 (雖然 Google 登入用不到，但為了傳統登入預先安裝)
# passport: 身分驗證的核心庫 (軍火庫)
# passport-google-oauth20: Google 登入的策略 (外掛)
# passport-line-auth 
npm install bcrypt @nestjs/passport passport passport-google-oauth20 passport-line-auth
# 安裝 TypeScript 定義檔 (開發環境用)
npm install -D @types/bcrypt @types/passport-google-oauth20
```

---

## 2. 環境設定

### 📄 檔案：`./backend/.env`

```env
# --- 資料庫連線設定 (對應 Docker Compose) ---
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=smart_market

# --- Google OAuth 設定 (GCP Console 申請) ---
GOOGLE_CLIENT_ID=你的GoogleClientID
GOOGLE_CLIENT_SECRET=你的GoogleClientSecret
# 回呼網址：Google 驗證完後要跳轉回來的後端路由
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback

# --- Line 設定 ---
LINE_CHANNEL_ID=你的LINE CHANNEL_ID
LINE_CHANNEL_SECRET=你的LINE CHANNEL_SECRET
LINE_CALLBACK_URL=http://localhost:8080/auth/line/callback
```

---

## 3. 核心模組設定 (AppModule)

### 📄 檔案：`./backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 用來讀取 .env 
import { TypeOrmModule } from '@nestjs/typeorm'; // 用來連接資料庫
import { AuthModule } from './auth/auth.module'; // 驗證模組
import { UsersModule } from './users/users.module'; // 使用者模組

@Module({
  imports: [
    // 1. 載入 ConfigModule 以讀取 .env
    ConfigModule.forRoot({ 
      isGlobal: true // 設定為全域，讓其他模組不用再 import 一次
    }),

    // 2. 設定資料庫連線
    // 使用 forRootAsync 是為了等待 ConfigModule 先讀完 .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') ?? 'localhost',
        port: configService.get<number>('DB_PORT') ?? 5432,
        username: configService.get<string>('DB_USER') ?? 'postgres',
        password: configService.get<string>('DB_PASSWORD') ?? 'password',
        database: configService.get<string>('DB_NAME') ?? 'smart_market',
        
        // 自動載入所有標記為 @Entity 的檔案
        autoLoadEntities: true,
        
        // ⚠️ 開發模式設為 true，會自動依照 Entity 修改資料庫結構
        // 正式上線 (Production) 務必改為 false 以免資料遺失
        synchronize: true,
        
        // 開啟 SQL Log，可以在終端機看到執行的 SQL 指令 (除錯用)
        logging: true,
      }),
    }),

    UsersModule, // 使用者模組
    AuthModule,  // 驗證模組
  ],
})
export class AppModule {}
```

---

## 4. Users 模組 (資料庫層)

先執行指令建立模組：
```bash
nest g resource users --no-spec
```

## 自動生成的檔案結構
users.controller.ts：定義 API 路由（例如：GET /users, POST /users）。

users.service.ts：處理 核心邏輯（例如：去資料庫找人、驗證密碼）。

users.module.ts：負責 打包，讓 NestJS 知道怎麼組裝這個模組。

dto/：存放「資料傳輸物件」，定義前端傳過來的資料長怎樣。

entities/users.entity.ts：這就是你剛才問的那個資料表定義檔。


### 📄 檔案：`apps/backend/src/users/entities/user.entity.ts`

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// 定義登入來源 Enum，避免打錯字
export enum UserProvider {
  GOOGLE = 'google',
  LINE = 'line',
  LOCAL = 'local',
}

@Entity('users') // 對應資料庫的 'users' 表格
export class User {
  // 使用 UUID (亂碼) 當作 ID，比數字 1,2,3 更安全
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true }) // Email 不可重複
  email: string;

  // 密碼欄位
  // select: false 代表查詢時預設「不回傳」，避免不小心把密碼洩漏給前端
  @Column({ nullable: true, select: false })
  password?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string; // 頭像網址

  // 記錄是用哪家登入的
  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.LOCAL,
  })
  provider: UserProvider;

  // 記錄 Google/LINE 那邊的 User ID
  @Column({ nullable: true })
  providerId: string;

  // 自動記錄建立時間
  @CreateDateColumn()
  createdAt: Date;

  // 自動記錄最後更新時間
  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 📄 檔案：`apps/backend/src/users/users.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    // 注入 User Repository，讓我們可以操作資料庫
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // --- OAuth 專用邏輯 ---
  
  // 建立並儲存 Google/Line 登入的使用者
  async createOAuthUser(details: Partial<User>) {
    const user = this.usersRepository.create(details);
    return this.usersRepository.save(user);
  }

  // 透過 Email 尋找使用者
  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  // --- 基本 CRUD (保留給未來擴充) ---
  
  create(createUserDto: CreateUserDto) { return 'This action adds a new user'; }
  findAll() { return `This action returns all users`; }
  
  // 注意：這裡接收的是 string (UUID)，而不是 number
  findOne(id: string) { return `This action returns a #${id} user`; }
  update(id: string, updateUserDto: UpdateUserDto) { return `This action updates a #${id} user`; }
  remove(id: string) { return `This action removes a #${id} user`; }
}
```

### 📄 檔案：`apps/backend/src/users/users.controller.ts`

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) { return this.usersService.create(createUserDto); }

  @Get()
  findAll() { return this.usersService.findAll(); }

  // ⬇️ 重點修正：拿掉 + 號
  // 因為我們用 UUID (字串)，+id 會試圖轉成數字導致 NaN 錯誤
  @Get(':id')
  findOne(@Param('id') id: string) { return this.usersService.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) { return this.usersService.update(id, updateUserDto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.usersService.remove(id); }
}
```

### 📄 檔案：`apps/backend/src/users/users.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  // 註冊 User Entity，讓 TypeORM 幫我們建表
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // 匯出 UsersService，這樣 AuthModule 才能呼叫它來存資料
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 5. Auth 模組 (Google 登入層)

先執行指令建立模組：
```bash
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec
```

### 📄 檔案：`apps/backend/src/auth/google.strategy.ts`
(需手動建立此檔案)

```typescript
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    // 設定 Google OAuth 參數
    // 使用 ?? '' 防止環境變數沒讀到時程式崩潰
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
      scope: ['email', 'profile'], // 我們要向 Google 請求的資料範圍
    });
  }

  // 當 Google 驗證成功後，會呼叫這個 validate 方法
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    
    // 整理 Google 回傳的資料
    // 使用 Optional Chaining (?.) 防止資料缺失報錯
    const details = {
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      providerId: profile.id,
      accessToken,
    };

    // 呼叫 AuthService 去資料庫「找人」或「註冊」
    const user = await this.authService.validateOAuthLogin(details);
    
    // done(錯誤, 回傳資料) -> 這會把 user 塞進 request 物件中
    done(null, user);
  }
}
```

### 📄 檔案：`apps/backend/src/auth/auth.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserProvider } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // 核心邏輯：Find or Create
  async validateOAuthLogin(details: any) {
    // 1. 先查資料庫有沒有這個人
    const user = await this.usersService.findOneByEmail(details.email);
    
    // 2. 如果有，直接回傳 (登入成功)
    if (user) return user;

    // 3. 如果沒有，建立新使用者 (註冊)
    console.log('User not found. Creating new user...');
    return this.usersService.createOAuthUser({
      email: details.email,
      name: `${details.firstName} ${details.lastName}`,
      avatar: details.picture,
      provider: UserProvider.GOOGLE,
      providerId: details.providerId,
    });
  }
}
```

### 📄 檔案：`apps/backend/src/auth/google-oauth.guard.ts`
(需手動建立此檔案)

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 自定義守衛，繼承 Passport 的 'google' 策略
@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {}
```

### 📄 檔案：`apps/backend/src/auth/auth.controller.ts`

```typescript
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleOAuthGuard } from './google-oauth.guard';

@Controller('auth')
export class AuthController {
  
  // 🚪 1. 出發門：導向 Google 登入頁面
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // 這裡由 Guard 自動處理跳轉
  }

  // 🚪 2. 回歸門：Google 驗證完跳回來的地方
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: Request) {
    // 這裡回傳 req.user，也就是從資料庫撈出來的完整會員資料
    // (req as any) 是為了繞過 TS 對 Request 型別的檢查
    return (req as any).user;
  }
}
```

### 📄 檔案：`apps/backend/src/auth/auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ConfigModule, PassportModule, UsersModule], // 引入 UsersModule 才能操作資料庫
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
```

---

## 6. 修改入口點 (Port)

### 📄 檔案：`apps/backend/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 設定 Port 為 8080，以配合 Google Console 的設定
  // 優先讀取環境變數，讀不到則用 8080
  const port = process.env.PORT ?? 8080;
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

---

## 7. 啟動測試

在終端機輸入：

```bash
npm run start:dev
```

開啟瀏覽器前往：`http://localhost:8080/auth/google`

預期結果：
1. 跳轉至 Google 登入。
2. 登入後跳轉回來，瀏覽器顯示 JSON 資料 (包含 UUID)。
3. 資料庫 `users` 表格中出現新資料。