import {
    IsOptional,
    IsNumber,
    Min,
    IsIn,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryProductDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    categoryId?: number; // 類別 ID (FK)

    @IsOptional()
    @IsString()
    search?: string; // 產品名稱搜尋

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @IsOptional()
    @IsIn(['newest', 'price-low', 'price-high'])
    sort?: 'newest' | 'price-low' | 'price-high';

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 9;
}
