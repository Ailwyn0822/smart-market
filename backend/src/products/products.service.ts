import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private notificationsService: NotificationsService,
  ) { }

  // 建立商品
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  // 取得所有商品（支援搜尋 + 分類篩選 + 分頁）
  async findAll(query?: { keyword?: string; category?: string; maxPrice?: number; page?: number; limit?: number }): Promise<{ items: Product[]; total: number }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;

    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC');

    if (query?.keyword) {
      qb.andWhere(
        '(product.name ILIKE :kw OR product.description ILIKE :kw)',
        { kw: `%${query.keyword}%` }
      );
    }

    if (query?.category) {
      qb.andWhere('category.name = :cat', { cat: query.category });
    }

    if (query?.maxPrice && query.maxPrice > 0) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }

  // 取得最新商品
  async findLatest(limit: number = 4): Promise<Product[]> {
    return this.productRepo.find({
      where: { isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // 取得單一商品（含賣家資訊）
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'seller'],
    });
    if (!product) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的商品`);
    }
    // 瀏覽次數 +1
    product.views = (product.views || 0) + 1;
    await this.productRepo.save(product);
    return product;
  }

  // 取得我的刊登商品（含收藏數）
  async findMyListings(userId: string) {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .loadRelationCountAndMap('product.favoritesCount', 'product.favorites')
      .where('product.userId = :userId', { userId })
      .orderBy('product.createdAt', 'DESC')
      .getMany();

    return products;
  }

  // 更新商品資料（賣家自用，需驗證擁有者）
  async update(productId: number, userId: string, dto: Partial<Product>): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('找不到此商品');
    if (product.userId !== userId) throw new ForbiddenException('您無權限修改此商品');
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  // 切換上/下架狀態（賣家自用，需驗證擁有者）
  async toggleActiveStatus(productId: number, userId: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('找不到此商品');
    if (product.userId !== userId) throw new ForbiddenException('您無權修改此商品');
    product.isActive = !product.isActive;
    return this.productRepo.save(product);
  }

  // ── Admin 專用 ────────────────────────────────────────

  // 取得所有商品（含下架 + 賣家資訊 + 分頁）
  async findAllAdmin(query: { keyword?: string; status?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.seller', 'seller')
      .orderBy('product.createdAt', 'DESC');

    if (query.keyword) {
      qb.andWhere('product.name ILIKE :kw', { kw: `%${query.keyword}%` });
    }
    if (query.status === 'active') {
      qb.andWhere('product.isActive = true');
    } else if (query.status === 'inactive') {
      qb.andWhere('product.isActive = false');
    }

    const [items, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { items, total, page, limit };
  }

  // 管理員切換商品上下架（略過擁有者驗證，並通知賣家）
  async adminToggleStatus(productId: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: ['seller'],
    });
    if (!product) throw new NotFoundException('找不到此商品');

    const wasActive = product.isActive;
    product.isActive = !product.isActive;
    const saved = await this.productRepo.save(product);

    // 若管理員將商品「下架」，通知賣家
    if (wasActive && !saved.isActive && product.userId) {
      await this.notificationsService.createNotification(
        product.userId,
        `您的商品「${product.name}」已被管理員下架，如有疑問請聯絡客服。`,
        'product_deactivated',
        String(product.id),
      );
    }

    return saved;
  }
}
