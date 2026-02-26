import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column({ type: 'uuid' })
    sellerId: string;

    @Column({ type: 'uuid' })
    buyerId: string;

    @Column({ nullable: true, default: null })
    productId: number;

    @Column({ type: 'int', default: 5 })
    rating: number; // 1 到 5 星滿意度

    @Column('text')
    comment: string;

    @CreateDateColumn()
    createdAt: Date;
}
