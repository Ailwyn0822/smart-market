import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    icon: string; // emoji 圖示

    @CreateDateColumn()
    createdAt: Date;
}
