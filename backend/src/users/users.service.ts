import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from '@smart-market/shared';
import { Product } from '../products/entities/product.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  // --- OAuth 專用邏輯 ---

  async createOAuthUser(details: Partial<User>) {
    const user = this.usersRepository.create(details);
    return this.usersRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  // 含 password 欄位（供本地登入驗證用）
  async findOneByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'avatar', 'password', 'provider', 'role'],
    });
  }

  // --- 個人資料 ---

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User | null> {
    await this.usersRepository.update(id, dto);
    return this.usersRepository.findOne({ where: { id } });
  }

  // --- 賣家店面資訊 ---

  async findStore(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return null;

    const [products, total] = await this.productRepository.findAndCount({
      where: { userId, isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: 12,
    });

    const reviews = await this.reviewRepository.find({ where: { sellerId: userId } });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return {
      seller: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        joinedAt: user.createdAt,
        rating: Math.round(avgRating * 10) / 10,
        totalProducts: total,
      },
      products,
      hasMore: total > 12,
    };
  }

  // 賣家商品分頁
  async findSellerProducts(userId: string, page: number, limit: number) {
    const [items, total] = await this.productRepository.findAndCount({
      where: { userId, isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  // --- Admin 專用 ---

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`找不到用戶 ${id}`);
    await this.usersRepository.update(id, { role });
    return this.usersRepository.findOne({ where: { id } }) as Promise<User>;
  }

  // --- 搜尋使用者 (給聊天功能用) ---

  async search(q: string): Promise<Pick<User, 'id' | 'name' | 'avatar' | 'email'>[]> {
    return this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.avatar', 'user.email'])
      .where('user.name ILIKE :q', { q: `%${q}%` })
      .orWhere('user.email ILIKE :q', { q: `%${q}%` })
      .take(10)
      .getMany();
  }
}
