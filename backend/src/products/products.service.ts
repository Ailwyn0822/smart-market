import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) { }

  // 建立商品
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  // 取得所有商品（支援搜尋 + 分類篩選）
  async findAll(query?: { keyword?: string; category?: string }): Promise<Product[]> {
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

    return qb.getMany();
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

  // 切換上/下架狀態
  async toggleActiveStatus(productId: number, userId: string): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('找不到此商品');
    if (product.userId !== userId) throw new ForbiddenException('您無權修改此商品');
    product.isActive = !product.isActive;
    return this.productRepo.save(product);
  }
}
