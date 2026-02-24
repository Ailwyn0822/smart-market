import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DiscountCodesService } from './discount-codes.service';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dto/update-discount-code.dto';

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
  update(@Param('id') id: string, @Body() updateDiscountCodeDto: UpdateDiscountCodeDto) {
    return this.discountCodesService.update(+id, updateDiscountCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountCodesService.remove(+id);
  }
}
