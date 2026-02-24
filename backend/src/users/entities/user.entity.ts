import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { UserProvider, UserRole } from '@smart-market/shared';

// 重新匯出，供此模組內其他檔案使用（向後相容）
export { UserProvider, UserRole };

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

  // --- 角色權限 ---
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // --- 系統自動記錄 ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];
}
