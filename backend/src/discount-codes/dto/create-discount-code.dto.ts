import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiscountCodeDto {
    @ApiProperty({ example: 'SAVE50', description: '折扣碼（唯一）' })
    @IsString()
    code: string;

    @ApiProperty({ example: 50, description: '折扣金額 (NTD)，固定折扣非百分比' })
    @IsNumber()
    @Min(0)
    discountAmount: number;

    @ApiPropertyOptional({ example: 100, description: '最大使用次數（0 = 無限制）', default: 0 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    maxUsages?: number;

    @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z', description: '有效期限（null = 永久）' })
    @IsDateString()
    @IsOptional()
    validUntil?: string;
}
