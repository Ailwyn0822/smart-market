import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: '二手玩具車', description: '商品名稱' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '九成新，輕微使用痕跡，功能正常', description: '商品描述' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 299, description: '商品價格 (NTD)' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 1, description: '商品分類 ID' })
  @IsNumber()
  @IsNotEmpty()
  categoryId: number;

  @ApiPropertyOptional({ example: 'Like New', description: '商品狀況', enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'] })
  @IsString()
  @IsOptional()
  condition?: string;

  @ApiPropertyOptional({ example: 1, description: '庫存數量', default: 1 })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 'https://storage.example.com/image.jpg', description: '商品圖片 URL' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
