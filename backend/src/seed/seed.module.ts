import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { DiscountCode } from '../discount-codes/entities/discount-code.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Product, Category, DiscountCode])],
    providers: [SeedService],
})
export class SeedModule { }
