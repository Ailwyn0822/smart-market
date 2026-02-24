import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorite } from '../../favorites/entities/favorite.entity';

// 定義登入來源：Google、LINE 或 Local (傳統帳密)
export enum UserProvider {
  GOOGLE = 'google',
  LINE = 'line',
  LOCAL = 'local',
}

@Entity('users')
export class User {
  // 使用 UUID 當作 ID，比數字 1,2,3 安全
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Email 必須唯一
  @Column({ unique: true })
  email: string;

  // --- 傳統登入專用欄位 ---
  @Column({
    nullable: true, // 允許為空 (因為用 Google 登入的人沒有密碼)
    select: false, // ✨ 資深技巧：查詢時預設「隱藏」，避免不小心把密碼傳給前端
  })
  password?: string; // 加個 ? 代表在程式裡它也是可選的

  // --- 基本資料 ---
  @Column()
  name: string;

  @Column({ nullable: true }) // 頭像可能是空的
  avatar: string;

  // --- 第三方登入專用欄位 ---
  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.LOCAL, // 預設是傳統登入
  })
  provider: UserProvider;

  @Column({ nullable: true })
  providerId: string; // 存 Google/LINE 給的 ID

  // --- 系統自動記錄 ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];
}
