// apps/backend/src/products/products.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { AiService } from '../ai/ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // 記得保護這個 API

@Controller('products')
export class ProductsController {
  constructor(
    private storageService: StorageService,
    private aiService: AiService,
  ) {}

  @Post('analyze')
  @UseGuards(JwtAuthGuard) // 需要登入才能用
  @UseInterceptors(FileInterceptor('file')) // 'file' 是前端上傳時的欄位名稱
  async analyze(@UploadedFile() file: Express.Multer.File) {
    // 1. 上傳到 MinIO
    const fileName = await this.storageService.upload(file);
    const fileUrl = this.storageService.getFileUrl(fileName);

    // 2. 呼叫 AI 分析
    const aiResult = await this.aiService.analyzeProductImage(file.buffer, file.mimetype);

    // 3. 回傳整合結果
    return {
      imageUrl: fileUrl,
      aiAnalysis: aiResult,
    };
  }
}
