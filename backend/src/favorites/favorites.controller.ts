import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyFavorites(@Req() req: Request) {
    const user = req.user as any;
    const userId = user?.userId;
    return this.favoritesService.getMyFavorites(userId);
  }

  @Get('check/:productId')
  @UseGuards(JwtAuthGuard)
  async checkFavorite(@Req() req: Request, @Param('productId') productId: string) {
    const user = req.user as any;
    const isFavorited = await this.favoritesService.checkFavorite(user.userId, +productId);
    return { isFavorited };
  }

  @Post(':productId/favorite')
  @UseGuards(JwtAuthGuard)
  addFavorite(@Req() req: Request, @Param('productId') productId: string) {
    const user = req.user as any;
    console.log('--- Req User in Controller ---', user);
    const userId = user?.userId;
    console.log('--- Parsed UserId ---', userId);
    return this.favoritesService.addFavorite(userId, +productId);
  }

  @Delete(':productId/favorite')
  @UseGuards(JwtAuthGuard)
  removeFavorite(@Req() req: Request, @Param('productId') productId: string) {
    const user = req.user as any;
    const userId = user?.userId;
    return this.favoritesService.removeFavorite(userId, +productId);
  }
}
