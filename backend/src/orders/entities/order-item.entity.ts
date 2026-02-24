import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    orderId: number;

    @Column({ nullable: true })
    productId: number;

    @Column()
    productName: string; // 快照，避免商品下架後看不到

    @Column({ nullable: true })
    productImageUrl: string; // 快照

    @Column()
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'uuid', nullable: true })
    sellerId: string;
}
