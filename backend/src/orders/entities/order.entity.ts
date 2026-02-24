import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus, PaymentMethod } from '@smart-market/shared';

// 重新匯出，供此模組內其他檔案使用（向後相容）
export { OrderStatus, PaymentMethod };

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    orderNumber: string;

    @Column()
    userId: string; // 對應 User uuid

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PROCESSING,
    })
    status: OrderStatus;

    @Column('decimal', { precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD })
    paymentMethod: PaymentMethod;

    @Column({ nullable: true })
    recipientName: string;

    @Column({ nullable: true })
    recipientEmail: string;

    @Column({ nullable: true })
    shippingAddress: string;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true,
        eager: true,
    })
    items: OrderItem[];

    @CreateDateColumn()
    createdAt: Date;
}
