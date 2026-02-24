import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Order } from '../orders/entities/order.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepo: Repository<Review>,
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly notificationsService: NotificationsService,
    ) { }

    async createReview(userId: string, orderId: number, rating: number, comment: string) {
        // 檢查訂單是否存在
        const order = await this.orderRepo.findOne({
            where: { id: orderId, userId },
            relations: ['items'],
        });

        if (!order) {
            throw new NotFoundException('找不到該訂單或您無權限評價');
        }

        if (order.status !== 'delivered') {
            throw new ConflictException('訂單需為已送達狀態才能評價');
        }

        // 檢查是否已評價過
        const existing = await this.reviewRepo.findOne({ where: { orderId } });
        if (existing) {
            throw new ConflictException('您已經為這筆訂單留下過評價了');
        }

        // 簡單處理：取第一個 item 的 seller 即可 (假設一般訂單只有一位賣家或評分對象為主)
        const sellerId = order.items.length > 0 ? order.items[0].sellerId : null;

        if (!sellerId) {
            throw new ConflictException('該筆訂單沒有對應的賣家可以評價');
        }

        const review = this.reviewRepo.create({
            orderId,
            buyerId: userId,
            sellerId,
            rating,
            comment,
        });

        const saved = await this.reviewRepo.save(review);

        // 若有關聯的使用者名稱可將此處買家姓名填入，暫時全寫「買家」
        this.notificationsService.createNotification(
            sellerId,
            `有買家對您的訂單留下了 ${rating} 星評價！`,
            'new_review',
            orderId.toString()
        ).catch(e => console.error('Failed to notify seller for review:', e));

        return saved;
    }

    // 給前端判斷該訂單是否已評價
    async checkIsReviewed(orderId: number) {
        const existing = await this.reviewRepo.findOne({ where: { orderId } });
        return { isReviewed: !!existing, review: existing };
    }

    // 取得指定賣家的所有評價 (支援分頁)
    async getReviewsBySeller(sellerId: string, page: number = 1, limit: number = 6) {
        const [reviews, total] = await this.reviewRepo.findAndCount({
            where: { sellerId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        // 為了前端顯示方便，這裡我們暫時只帶上 buyerId。
        // 若有關聯 (relations) 可在這裡載入 buyer 的 avatar 或 name。
        // 由於 Review 尚未設定關聯，我們先回傳即可。
        return {
            items: reviews,
            total,
            page,
            limit,
            hasMore: page * limit < total,
        };
    }
}
