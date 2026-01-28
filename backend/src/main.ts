import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session'; // 1. 引入這個

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret', // 加密用的鑰匙，隨便打
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
