// apps/backend/src/products/products.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Get,
  Body,
  Param,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 記得保護這個 API
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private storageService: StorageService,
    private aiService: AiService,
    private productsService: ProductsService,
  ) { }

  @Post('analyze')
  @UseGuards(JwtAuthGuard) // 需要登入才能用
  @UseInterceptors(FileInterceptor('file')) // 'file' 是前端上傳時的欄位名稱
  async analyze(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log('Starting analysis for file:', file.originalname);

      // 1. 上傳到 MinIO
      const fileName = await this.storageService.upload(file);
      console.log('Use StorageService.upload success:', fileName);
      const fileUrl = this.storageService.getFileUrl(fileName);

      // 2. 呼叫 AI 分析
      const aiResult = await this.aiService.analyzeProductImage(file.buffer, file.mimetype);
      console.log('AI Analysis result:', aiResult);

      // 3. 回傳整合結果
      return {
        imageUrl: fileUrl,
        aiAnalysis: aiResult,
      };
    } catch (error) {
      console.error('Error in analyze endpoint:', error);
      throw error;
    }
  }

  // 👇 新增：存檔 API
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  // 👇 新增：列表 API (之後用)
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id); // +id 把字串轉數字
  }
}
