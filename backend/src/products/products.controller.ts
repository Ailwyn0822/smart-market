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
import type { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';

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
  async getMyListings(@Req() req: Request) {
    const user = req.user as any;
    return this.productsService.findMyListings(user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: Request, @Body() body: CreateProductDto) {
    const user = req.user as any;
    return this.productsService.create({ ...body, userId: user.userId });
  }

  @Get()
  async findAll(
    @Query('keyword') keyword?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll({ keyword, category });
  }

  @Get('latest')
  async getLatest() {
    return this.productsService.findLatest(4);
  }

  @Patch(':id/active_status')
  @UseGuards(JwtAuthGuard)
  async toggleActiveStatus(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as any;
    return this.productsService.toggleActiveStatus(+id, user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
