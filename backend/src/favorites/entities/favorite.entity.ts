import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'uuid' })
    userId: string;

    @Column()
    productId: number;

    @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Product, (product) => product.favorites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @CreateDateColumn()
    createdAt: Date;
}
