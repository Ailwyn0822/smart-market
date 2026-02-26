import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductQuestion } from './entities/product-question.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductQuestionsService {
    constructor(
        @InjectRepository(ProductQuestion)
        private readonly questionRepo: Repository<ProductQuestion>,
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
    ) { }

    async getByProduct(productId: number) {
        return this.questionRepo.find({
            where: { productId },
            order: { createdAt: 'DESC' },
        });
    }

    async askQuestion(productId: number, askerId: string, question: string) {
        const product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) throw new NotFoundException('找不到此商品');

        const qa = this.questionRepo.create({
            productId,
            sellerId: product.userId,
            askerId,
            question,
        });
        return this.questionRepo.save(qa);
    }

    async answerQuestion(id: number, userId: string, answer: string) {
        const qa = await this.questionRepo.findOne({ where: { id } });
        if (!qa) throw new NotFoundException('找不到此問題');
        if (qa.sellerId !== userId) throw new ForbiddenException('只有賣家可以回答此問題');

        qa.answer = answer;
        qa.answeredAt = new Date();
        return this.questionRepo.save(qa);
    }

    async deleteQuestion(id: number, userId: string) {
        const qa = await this.questionRepo.findOne({ where: { id } });
        if (!qa) throw new NotFoundException('找不到此問題');
        if (qa.askerId !== userId && qa.sellerId !== userId) {
            throw new ForbiddenException('您無權刪除此問題');
        }
        await this.questionRepo.remove(qa);
        return { success: true };
    }
}
