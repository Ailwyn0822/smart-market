import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { StorageModule } from '../storage/storage.module'; // 👈 匯入 StorageModule
import { AiModule } from '../ai/ai.module'; // 👈 匯入 AiModule

import { AuthModule } from '../auth/auth.module'; // 👈 匯入 AuthModule

@Module({
  imports: [StorageModule, AiModule, AuthModule], // 這樣 Controller 才能用 storageService 和 aiService 以及 JwtAuthGuard
  controllers: [ProductsController],
})
export class ProductsModule {}
