import { Injectable, NotFoundException } from '@nestjs/common';
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

  // 取得所有商品 (之後列表頁會用到)
  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  // 取得最新商品
  async findLatest(limit: number = 4): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['category'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // 取得單一商品
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`找不到 ID 為 ${id} 的商品`);
    }
    return product;
  }
}
