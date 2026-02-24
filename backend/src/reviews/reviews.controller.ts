import { Controller, Post, Get, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createReview(
        @Req() req: Request,
        @Body('orderId', ParseIntPipe) orderId: number,
        @Body('rating') rating: number,
        @Body('comment') comment: string,
    ) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.reviewsService.createReview(userId, orderId, rating, comment);
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
}
