import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class DiscountCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @Column('decimal', { precision: 10, scale: 2 })
    discountAmount: number;

    @Column({ default: 0 })
    maxUsages: number; // 0 表示無限制

    @Column({ default: 0 })
    currentUsages: number;

    @Column({ type: 'timestamp', nullable: true })
    validUntil: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
