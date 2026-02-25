// --------------------------------------------------------
// 1. 引入區：就像食譜要先準備食材
// --------------------------------------------------------
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 管理員工具
import { TypeOrmModule } from '@nestjs/typeorm'; // 資料庫連線工具
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { StorageModule } from './storage/storage.module';
import { AiModule } from './ai/ai.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EcpayModule } from './ecpay/ecpay.module';
import { DiscountCodesModule } from './discount-codes/discount-codes.module';
import { SeedModule } from './seed/seed.module';

// --------------------------------------------------------
// 2. @Module 裝飾器：這是 NestJS 定義「模組」的方式
// --------------------------------------------------------
@Module({
  imports: [
    // --- 第一部分：啟動保險箱管理員 (ConfigModule) ---
    ConfigModule.forRoot({
      isGlobal: true, // 這行說：「把設定檔變成全域的，這樣以後在別的檔案想讀密碼，不用再 import 一次 ConfigModule」
    }),
    EventEmitterModule.forRoot(),

    // --- 第二部分：啟動資料庫連線 (TypeOrmModule) ---
    // 這裡為什麼要用 forRootAsync (非同步)？
    // 因為我們要先等上面的 ConfigModule 把 .env 讀完，我們才拿得到密碼。
    // 如果用普通的 forRoot，可能密碼還沒讀進來就嘗試連線，會失敗。
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 這裡說：「我要借用 ConfigModule」
      inject: [ConfigService], // 這裡說：「請把 ConfigService (讀取器) 注射給我用」

      // useFactory: 這是一個工廠函式，NestJS 會執行它來產生資料庫設定
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // 告訴 TypeORM 我們用的是 Postgres 資料庫

        // 下面這幾行就是用 configService 去讀 .env 裡面的值
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),

        // autoLoadEntities: 自動掃描你的專案，只要檔案裡有寫 @Entity() 的，通通載入變成資料表
        // 這樣你就不用手動一個一個把 User, Order, Product 加進來
        autoLoadEntities: true,

        // synchronize: 同步模式 (雙面刃！)
        // true = 當你改了程式碼 (例如加了 phone 欄位)，重啟時它會「自動修改」資料庫結構。
        // 開發時超方便；但上線(Production)絕對要關掉，不然它可能會不小心刪掉你的資料。
        synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),

    UsersModule,

    AuthModule,

    StorageModule,
    AiModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    FavoritesModule,
    ChatModule,
    NotificationsModule,
    ReviewsModule,
    EcpayModule,
    DiscountCodesModule,
    SeedModule,
  ],
  controllers: [AppController], // 路由控制器 (處理網址請求的)
  providers: [AppService], // 服務提供者 (寫邏輯的)
})
export class AppModule { }
