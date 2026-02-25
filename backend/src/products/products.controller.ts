import {
  Controller,
  Post,
  Get,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Body,
  Param,
  Query,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '@smart-market/shared';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private storageService: StorageService,
    private aiService: AiService,
    private productsService: ProductsService,
  ) { }

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'AI 商品圖片分析', description: '上傳商品圖片，AI 自動分析並建議名稱、分類、價格' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: '分析成功，回傳圖片 URL 和 AI 建議' })
  async analyze(@UploadedFile() file: Express.Multer.File) {
    try {
      // 先審核內容，通過後才存圖，避免違禁圖片寫入儲存空間
      const aiResult = await this.aiService.analyzeProductImage(file.buffer, file.mimetype);

      if (aiResult.flagged) {
        console.warn('Content violation detected:', aiResult.reason);
        throw new BadRequestException('CONTENT_VIOLATION');
      }

      const fileName = await this.storageService.upload(file);
      const fileUrl = this.storageService.getFileUrl(fileName);
      return { imageUrl: fileUrl, aiAnalysis: aiResult };
    } catch (error) {
      console.error('Error in analyze endpoint:', error);
      throw error;
    }
  }

  // ── 必須放在 :id 之前 ────────────────────────────────
  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '我的商品列表', description: '取得當前登入用戶上架的所有商品' })
  @ApiResponse({ status: 200, description: '商品清單' })
  async getMyListings(@Req() req: Request) {
    const user = req.user as any;
    return this.productsService.findMyListings(user.userId);
  }

  // ── Admin 端點（需放在 :id 之前）─────────────────────
  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '（Admin）取得所有商品列表（含下架）' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'status', required: false, description: 'all | active | inactive' })
  @ApiResponse({ status: 200, description: '{ items, total, page, limit }' })
  async adminList(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
  ) {
    return this.productsService.findAllAdmin({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      keyword,
      status,
    });
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '（Admin）切換任意商品上下架狀態並通知賣家' })
  @ApiParam({ name: 'id', description: '商品 ID' })
  @ApiResponse({ status: 200, description: '狀態更新成功' })
  async adminToggle(@Param('id') id: string) {
    return this.productsService.adminToggleStatus(+id);
  }

  // ── 公開端點 ────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '建立商品', description: '上架新商品' })
  @ApiResponse({ status: 201, description: '商品建立成功' })
  async create(@Req() req: Request, @Body() body: CreateProductDto) {
    const user = req.user as any;
    return this.productsService.create({ ...body, userId: user.userId });
  }

  @Get()
  @ApiOperation({ summary: '搜尋商品列表', description: '支援關鍵字、分類篩選及分頁' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, description: '頁碼（預設 1）' })
  @ApiQuery({ name: 'limit', required: false, description: '每頁筆數（預設 20）' })
  @ApiResponse({ status: 200, description: '{ items: Product[], total: number }' })
  async findAll(
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll({
      keyword,
      category,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get('latest')
  @ApiOperation({ summary: '最新商品', description: '取得最新上架的 4 個商品' })
  @ApiResponse({ status: 200, description: '最新商品清單' })
  async getLatest() {
    return this.productsService.findLatest(4);
  }

  @Patch(':id/active_status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '切換商品上下架狀態（賣家）' })
  @ApiParam({ name: 'id', description: '商品 ID' })
  @ApiResponse({ status: 200, description: '狀態更新成功' })
  async toggleActiveStatus(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.productsService.toggleActiveStatus(+id, user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '取得單一商品詳情' })
  @ApiParam({ name: 'id', description: '商品 ID' })
  @ApiResponse({ status: 200, description: '商品詳情' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
