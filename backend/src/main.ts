import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true,
  });

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Swagger API 文件設定
  const config = new DocumentBuilder()
    .setTitle('Smart Market API')
    .setDescription('Smart Market 二手市集 RESTful API 文件')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '請輸入 JWT token（登入後取得）',
      },
      'JWT-auth',
    )
    .addTag('auth', '認證 - 登入、註冊、OAuth')
    .addTag('users', '用戶 - 個人資料、搜尋')
    .addTag('products', '商品 - 列表、詳情、建立')
    .addTag('orders', '訂單 - 建立、查詢、狀態更新')
    .addTag('categories', '分類 - 商品分類管理')
    .addTag('favorites', '收藏 - 我的最愛')
    .addTag('discount-codes', '折扣碼 - 驗證與管理')
    .addTag('reviews', '評價 - 賣家評分')
    .addTag('notifications', '通知 - 系統通知')
    .addTag('chat', '聊天 - 即時訊息')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 8080);
  console.log(`✅ Smart Market API 啟動：http://localhost:${process.env.PORT ?? 8080}`);
  console.log(`📚 Swagger 文件：http://localhost:${process.env.PORT ?? 8080}/api`);
}
bootstrap();
