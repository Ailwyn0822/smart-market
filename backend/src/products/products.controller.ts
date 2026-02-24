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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

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
      const fileName = await this.storageService.upload(file);
      const fileUrl = this.storageService.getFileUrl(fileName);
      const aiResult = await this.aiService.analyzeProductImage(file.buffer, file.mimetype);
      return { imageUrl: fileUrl, aiAnalysis: aiResult };
    } catch (error) {
      console.error('Error in analyze endpoint:', error);
      throw error;
    }
  }

  // 必須放在 :id 之前，否則 'my-listings' 會被當成 id
  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '我的商品列表', description: '取得當前登入用戶上架的所有商品' })
  @ApiResponse({ status: 200, description: '商品清單' })
  async getMyListings(@Req() req: Request) {
    const user = req.user as any;
    return this.productsService.findMyListings(user.userId);
  }

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
  @ApiOperation({ summary: '搜尋商品列表', description: '支援關鍵字和分類篩選' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜尋關鍵字' })
  @ApiQuery({ name: 'category', required: false, description: '分類名稱' })
  @ApiResponse({ status: 200, description: '商品清單' })
  async findAll(
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll({ keyword, category });
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
  @ApiOperation({ summary: '切換商品上下架狀態' })
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
