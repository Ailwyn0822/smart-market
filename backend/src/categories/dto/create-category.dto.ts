import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    slug: string;

    @IsString()
    @IsOptional()
    icon?: string;
}
