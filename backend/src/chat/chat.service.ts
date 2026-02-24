import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepo: Repository<Message>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async saveMessage(senderId: string, receiverId: string, content: string) {
        const msg = this.messageRepo.create({ senderId, receiverId, content });
        return this.messageRepo.save(msg);
    }

    // Get chat history with a specific user
    async getChatHistory(userId1: string, userId2: string) {
        return this.messageRepo
            .createQueryBuilder('msg')
            .where('(msg.senderId = :userId1 AND msg.receiverId = :userId2) OR (msg.senderId = :userId2 AND msg.receiverId = :userId1)', {
                userId1,
                userId2,
            })
            .orderBy('msg.createdAt', 'ASC')
            .getMany();
    }

    // 取得最新聯絡人列表
    async getContacts(userId: string) {
        // 找出所有與我有關的訊息
        const messages = await this.messageRepo
            .createQueryBuilder('msg')
            .where('msg.senderId = :userId OR msg.receiverId = :userId', { userId })
            .orderBy('msg.createdAt', 'DESC')
            .getMany();

        // 提取聯絡人 ID
        const contactIds = new Set<string>();
        messages.forEach(msg => {
            if (msg.senderId !== userId) contactIds.add(msg.senderId);
            if (msg.receiverId !== userId) contactIds.add(msg.receiverId);
        });

        if (contactIds.size === 0) return [];

        // 取得聯絡人詳細資訊
        const contactsInfo = await this.userRepo
            .createQueryBuilder('user')
            .where('user.id IN (:...contactIds)', { contactIds: Array.from(contactIds) })
            .select(['user.id', 'user.name', 'user.avatar'])
            .getMany();

        // 這裡還可以把最後一句對話帶出，為簡化先回傳 users
        return contactsInfo;
    }
}
