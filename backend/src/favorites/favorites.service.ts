import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    private readonly productsService: ProductsService,
  ) { }

  async addFavorite(userId: string, productId: number) {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('找不到商品');
    }

    const existing = await this.favoriteRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existing) {
      throw new ConflictException('已收藏過此商品');
    }

    const favorite = this.favoriteRepo.create({
      userId,
      productId,
      user: { id: userId },
      product: { id: productId },
    });

    try {
      await this.favoriteRepo.save(favorite);
    } catch (err) {
      console.error('Failed to save favorite:', err);
      throw err;
    }
    return { success: true };
  }

  async removeFavorite(userId: string, productId: number) {
    const favorite = await this.favoriteRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (!favorite) {
      throw new NotFoundException('找不到此收藏紀錄');
    }

    try {
      await this.favoriteRepo.remove(favorite);
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      throw err;
    }

    return { success: true };
  }

  async getMyFavorites(userId: string) {
    const favorites = await this.favoriteRepo.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.seller'],
      order: { createdAt: 'DESC' },
    });

    return favorites.map((fav) => fav.product);
  }

  async checkFavorite(userId: string, productId: number): Promise<boolean> {
    const favorite = await this.favoriteRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    return !!favorite;
  }
}
