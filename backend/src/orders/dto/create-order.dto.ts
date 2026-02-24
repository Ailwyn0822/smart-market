import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderItemDto {
    @ApiPropertyOptional({ example: 1, description: '商品 ID（可為空）' })
    @IsOptional()
    @IsNumber()
    productId?: number;

    @ApiProperty({ example: '二手玩具車', description: '商品名稱快照' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'https://storage.example.com/img.jpg', description: '商品圖片 URL' })
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ example: 1, description: '購買數量' })
    @IsNumber()
    quantity: number;

    @ApiProperty({ example: 299, description: '商品單價 (NTD)' })
    @IsNumber()
    price: number;

    @ApiPropertyOptional({ example: 'uuid-of-seller', description: '賣家 UUID' })
    @IsOptional()
    @IsString()
    sellerId?: string;
}

export class CreateOrderDto {
    @ApiProperty({ example: '王小明', description: '收件人姓名' })
    @IsString()
    recipientName: string;

    @ApiProperty({ example: 'buyer@example.com', description: '收件人 Email' })
    @IsEmail()
    recipientEmail: string;

    @ApiProperty({ example: '台北市信義區信義路五段7號', description: '收件地址' })
    @IsString()
    shippingAddress: string;

    @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD, description: '付款方式' })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({ example: 299, description: '訂單總金額 (NTD)' })
    @IsNumber()
    amount: number;

    @ApiProperty({ type: [CreateOrderItemDto], description: '訂單商品清單' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
