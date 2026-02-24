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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiConsumes } from '@nestjs/swagger';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StorageService } from '../storage/storage.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '@smart-market/shared';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '取得個人資料', description: '取得當前登入用戶的完整資料' })
  @ApiResponse({ status: 200, description: '用戶資料' })
  getProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.usersService.findById(user.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '更新個人資料', description: '更新名稱或頭像 URL' })
  @ApiResponse({ status: 200, description: '更新成功' })
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const user = req.user as any;
    return this.usersService.updateProfile(user.userId, dto);
  }

  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '上傳頭像', description: '上傳頭像圖片至 MinIO，回傳圖片 URL' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: '上傳成功，回傳 imageUrl' })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const fileName = await this.storageService.upload(file);
    const imageUrl = this.storageService.getFileUrl(fileName);
    return { imageUrl };
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '搜尋用戶', description: '依名稱或 Email 搜尋用戶（給聊天功能使用）' })
  @ApiQuery({ name: 'q', description: '搜尋關鍵字' })
  @ApiResponse({ status: 200, description: '用戶列表' })
  search(@Query('q') q: string) {
    if (!q || q.trim().length < 1) return [];
    return this.usersService.search(q.trim());
  }

  // === Admin 專用端點 ===

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '取得所有用戶（Admin）', description: '管理員端點：取得所有用戶列表' })
  @ApiResponse({ status: 200, description: '用戶列表' })
  @ApiResponse({ status: 403, description: '需要管理員身份' })
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '修改用戶角色（Admin）', description: '管理員端點：修改指定用戶的角色' })
  @ApiParam({ name: 'id', description: '用戶 UUID' })
  @ApiResponse({ status: 200, description: '角色更新成功' })
  @ApiResponse({ status: 403, description: '需要管理員身份' })
  updateRole(@Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role);
  }

  @Get(':id/store')
  @ApiOperation({ summary: '取得賣家店面', description: '公開端點，取得賣家資料和商品列表' })
  @ApiParam({ name: 'id', description: '賣家用戶 UUID' })
  @ApiResponse({ status: 200, description: '賣家店面資訊' })
  @ApiResponse({ status: 404, description: '找不到此賣家' })
  async getStore(@Param('id') id: string) {
    const store = await this.usersService.findStore(id);
    if (!store) throw new NotFoundException('找不到此賣家');
    return store;
  }
}
