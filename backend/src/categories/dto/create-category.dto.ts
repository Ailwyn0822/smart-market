import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: '玩具', description: '分類名稱（最多 50 字元）' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @ApiProperty({ example: 'toys', description: '分類 slug（URL 用，最多 50 字元）' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    slug: string;

    @ApiPropertyOptional({ example: '🧸', description: '分類圖示（emoji）' })
    @IsString()
    @IsOptional()
    icon?: string;
}
