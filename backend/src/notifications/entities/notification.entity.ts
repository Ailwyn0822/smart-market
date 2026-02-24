import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string; // 接收通知的玩家

    @Column()
    message: string;

    @Column({ default: false })
    isRead: boolean;

    @Column({ nullable: true })
    type: string; // 'order_update', 'new_review', etc.

    @Column({ nullable: true })
    referenceId: string; // 關聯的 orderId 或 reviewId 字串以便跳轉

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
