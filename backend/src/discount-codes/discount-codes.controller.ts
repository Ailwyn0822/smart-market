import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountCodesService } from './discount-codes.service';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dto/update-discount-code.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@smart-market/shared';

@ApiTags('discount-codes')
@Controller('discount-codes')
export class DiscountCodesController {
  constructor(private readonly discountCodesService: DiscountCodesService) { }

  @Post('validate')
  @ApiOperation({ summary: '驗證折扣碼', description: '驗證折扣碼是否有效，回傳折扣金額' })
  @ApiResponse({ status: 200, description: '折扣碼有效，回傳折扣資訊' })
  @ApiResponse({ status: 404, description: '折扣碼無效或已過期' })
  validate(@Body('code') code: string) {
    return this.discountCodesService.validateCode(code);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '建立折扣碼（Admin）' })
  create(@Body() createDiscountCodeDto: CreateDiscountCodeDto) {
    return this.discountCodesService.create(createDiscountCodeDto);
  }

  @Get()
  @ApiOperation({ summary: '取得所有折扣碼（公開）' })
  @ApiResponse({ status: 200, description: '折扣碼列表' })
  findAll() {
    return this.discountCodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountCodesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '更新折扣碼（Admin）' })
  update(@Param('id') id: string, @Body() updateDiscountCodeDto: UpdateDiscountCodeDto) {
    return this.discountCodesService.update(+id, updateDiscountCodeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: '刪除折扣碼（Admin）' })
  remove(@Param('id') id: string) {
    return this.discountCodesService.remove(+id);
  }
}
