import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductQuestion } from './entities/product-question.entity';
import { Product } from '../products/entities/product.entity';
import { ProductQuestionsService } from './product-questions.service';
import { ProductQuestionsController } from './product-questions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductQuestion, Product])],
    controllers: [ProductQuestionsController],
    providers: [ProductQuestionsService],
})
export class ProductQuestionsModule { }
