import { IsArray, IsEmail, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderItemDto {
    @IsOptional()
    @IsNumber()
    productId?: number;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    sellerId?: string;
}

export class CreateOrderDto {
    @IsString()
    recipientName: string;

    @IsEmail()
    recipientEmail: string;

    @IsString()
    shippingAddress: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsNumber()
    amount: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
