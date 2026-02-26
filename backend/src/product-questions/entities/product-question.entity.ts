import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('product_questions')
export class ProductQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column({ type: 'uuid' })
    sellerId: string;

    @Column({ type: 'uuid', nullable: true })
    askerId: string;

    @Column('text')
    question: string;

    @Column({ type: 'text', nullable: true })
    answer: string;

    @Column({ type: 'timestamptz', nullable: true })
    answeredAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}
