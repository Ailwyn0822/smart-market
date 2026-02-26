import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { StorageModule } from '../storage/storage.module';
import { AiModule } from '../ai/ai.module';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [StorageModule, AiModule, AuthModule, NotificationsModule, CategoriesModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }
