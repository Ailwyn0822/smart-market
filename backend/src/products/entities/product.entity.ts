import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  price: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ default: 'New' })
  condition: string;

  @Column({ default: 1 })
  stock: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'userId' })
  seller: User;

  @OneToMany(() => Favorite, (fav) => fav.product)
  favorites: Favorite[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  createdAt: Date;
}
