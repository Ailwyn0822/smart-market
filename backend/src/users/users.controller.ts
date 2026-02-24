import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Req,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StorageService } from '../storage/storage.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  // 取得目前登入使用者的個人資料
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.findById(user.userId);
  }

  // 更新個人資料（名稱、頭像）
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const user = req.user as any;
    return this.usersService.updateProfile(user.userId, dto);
  }

  // 上傳大頭貼到 MinIO，回傳圖片 URL
  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const fileName = await this.storageService.upload(file);
    const imageUrl = this.storageService.getFileUrl(fileName);
    return { imageUrl };
  }

  // 搜尋使用者（給聊天功能用）
  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query('q') q: string) {
    if (!q || q.trim().length < 1) return [];
    return this.usersService.search(q.trim());
  }

  // 取得賣家店面資訊（公開，不需要登入）
  @Get(':id/store')
  async getStore(@Param('id') id: string) {
    const store = await this.usersService.findStore(id);
    if (!store) throw new NotFoundException('找不到此賣家');
    return store;
  }
}
