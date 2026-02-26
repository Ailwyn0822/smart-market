import { Controller, Post, Get, Body, Param, Req, UseGuards, ParseIntPipe, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('bulk')
    @ApiOperation({ summary: '批次提交評價（每商品 + 賣家）' })
    async createBulkReviews(
        @Req() req: Request,
        @Body('orderId') orderId: number,
        @Body('items') items: { productId?: number; rating: number; comment: string }[],
    ) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        if (!orderId || !Array.isArray(items) || items.length === 0) {
            throw new BadRequestException('orderId 與 items 為必填');
        }
        return this.reviewsService.createBulkReviews(userId, +orderId, items);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createReview(
        @Req() req: Request,
        @Body('orderId', ParseIntPipe) orderId: number,
        @Body('rating') rating: number,
        @Body('comment') comment: string,
        @Body('productId') productId?: number,
    ) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.reviewsService.createReview(userId, orderId, rating, comment, productId ? +productId : undefined);
    }

    @UseGuards(JwtAuthGuard)
    @Get('check/:orderId')
    async checkReviewed(@Param('orderId', ParseIntPipe) orderId: number) {
        return this.reviewsService.checkIsReviewed(orderId);
    }

    @Get('seller/:sellerId')
    async getSellerReviews(
        @Param('sellerId') sellerId: string,
        @Req() req: Request
    ) {
        const query = req.query;
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 6;
        return this.reviewsService.getReviewsBySeller(sellerId, page, limit);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: '取得商品評價', description: '公開端點，取得指定商品的評價列表' })
    async getProductReviews(
        @Param('productId', ParseIntPipe) productId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.reviewsService.getReviewsByProduct(productId, page ? +page : 1, limit ? +limit : 6);
    }
}
