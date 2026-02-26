import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductQuestionsService } from './product-questions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('product-questions')
@Controller('product-questions')
export class ProductQuestionsController {
    constructor(private readonly service: ProductQuestionsService) { }

    @Get('product/:productId')
    @ApiOperation({ summary: '取得商品 Q&A 列表（公開）' })
    getByProduct(@Param('productId', ParseIntPipe) productId: number) {
        return this.service.getByProduct(productId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: '提問（需登入）' })
    askQuestion(
        @Req() req: Request,
        @Body('productId', ParseIntPipe) productId: number,
        @Body('question') question: string,
    ) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.service.askQuestion(productId, userId, question);
    }

    @Post(':id/answer')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: '賣家回答問題（需登入）' })
    answerQuestion(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body('answer') answer: string,
    ) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.service.answerQuestion(id, userId, answer);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: '刪除問題（提問者或賣家）' })
    deleteQuestion(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.service.deleteQuestion(id, userId);
    }
}
