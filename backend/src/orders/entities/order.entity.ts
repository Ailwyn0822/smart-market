import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
}

export enum PaymentMethod {
    COD = 'cod',
    ONLINE = 'online',
}

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
