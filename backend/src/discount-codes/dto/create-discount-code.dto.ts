import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateDiscountCodeDto {
    @IsString()
    code: string;

    @IsNumber()
    @Min(0)
    discountAmount: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    maxUsages?: number;

    @IsDateString()
    @IsOptional()
    validUntil?: string;
}
