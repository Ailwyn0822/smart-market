import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepo: Repository<Notification>,
        private eventEmitter: EventEmitter2
    ) { }

    async createNotification(userId: string, message: string, type?: string, referenceId?: string) {
        const notification = this.notificationsRepo.create({
            userId,
            message,
            type,
            referenceId
        });
        const saved = await this.notificationsRepo.save(notification);

        // 觸發事件給 SSE 訂閱者
        this.eventEmitter.emit(`notification.${userId}`, saved);
        return saved;
    }

    async getNotifications(userId: string, limit: number = 20) {
        const [items, unreadCount] = await Promise.all([
            this.notificationsRepo.find({
                where: { userId },
                order: { createdAt: 'DESC' },
                take: limit
            }),
            this.notificationsRepo.count({ where: { userId, isRead: false } })
        ]);

        return { items, unreadCount };
    }

    async markAllAsRead(userId: string) {
        await this.notificationsRepo.update({ userId, isRead: false }, { isRead: true });
        return { success: true };
    }
}
