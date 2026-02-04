import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. 引入
import { ProductsController } from './products.controller';
import { StorageModule } from '../storage/storage.module'; // 👈 匯入 StorageModule
import { AiModule } from '../ai/ai.module'; // 👈 匯入 AiModule
import { Product } from './entities/product.entity'; // 2. 引入 Entity
import { ProductsService } from './products.service'; // 3. 引入 Service (等等會建)
import { AuthModule } from '../auth/auth.module'; // 👈 匯入 AuthModule

@Module({
  imports: [StorageModule, AiModule, AuthModule, TypeOrmModule.forFeature([Product])], // 這樣 Controller 才能用 storageService 和 aiService 以及 JwtAuthGuard
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
